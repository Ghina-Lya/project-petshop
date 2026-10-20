"use server"
import { db } from './db';
import { redirect } from 'next/navigation';

// --- FETCH DATA ---
export async function getTopCategories() {
  const [rows]: any = await db.query(
    "SELECT * FROM Category WHERE parentId IS NULL ORDER BY id ASC"
  );
  const categories = rows;

  for (let cat of categories) {
    const [subRows]: any = await db.query(
      "SELECT * FROM Category WHERE parentId = ? ORDER BY id ASC",
      [cat.id]
    );
    cat.children = subRows;
  }
  return categories;
}

export async function getProducts(categoryId?: number) {
  let query = `
    SELECT p.*, c.name as categoryName, c.slug as categorySlug, c.type as categoryType, 
           p2.name as parentCategoryName, p2.slug as parentCategorySlug 
    FROM Product p
    JOIN Category c ON p.categoryId = c.id
    LEFT JOIN Category p2 ON c.parentId = p2.id
  `;
  const params: any[] = [];

  if (categoryId) {
    query += ` WHERE p.categoryId = ? OR c.parentId = ?`;
    params.push(categoryId, categoryId);
  }

  query += ` ORDER BY p.id DESC`;
  const [rows]: any = await db.query(query, params);
  
  return rows.map((r: any) => ({
    ...r,
    price: Number(r.price),
    category: {
      name: r.categoryName,
      slug: r.categorySlug,
      type: r.categoryType,
      parent: r.parentCategoryName ? { 
        name: r.parentCategoryName, 
        slug: r.parentCategorySlug 
      } : null,
    }
  }));
}

// --- AUTH ACTIONS ---
export async function registerUser(formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  try {
    await db.query(
      "INSERT INTO Users (name, email, password, role) VALUES (?, ?, ?, 'customer')",
      [name, email, password]
    );
  } catch (error) {
    console.error("Register error:", error);
    throw new Error("Email sudah terdaftar atau terjadi kesalahan.");
  }
  redirect('/login');
}

export async function loginUser(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const [rows]: any = await db.query(
    "SELECT * FROM Users WHERE email = ? AND password = ?",
    [email, password]
  );

  if (rows.length === 0) {
    throw new Error("Email atau password salah!");
  }

  const user = rows[0];
  if (user.role === 'admin') {
    redirect('/admin/products');
  } else {
    redirect('/home');
  }
}

// --- CRUD PRODUCTS (ADMIN) ---
export async function addProduct(formData: FormData) {
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const price = Number(formData.get('price'));
  const stock = Number(formData.get('stock'));
  const imageUrl = formData.get('imageUrl') as string;
  const categoryId = Number(formData.get('categoryId'));

  await db.query(
    "INSERT INTO Product (name, description, price, stock, imageUrl, categoryId) VALUES (?, ?, ?, ?, ?, ?)",
    [name, description, price, stock, imageUrl, categoryId]
  );
  redirect('/admin/products');
}

export async function deleteProduct(id: number) {
  await db.query("DELETE FROM Product WHERE id = ?", [id]);
}