"use server";

import { db } from "./db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// ===== SESSION =====
export async function getSession() {
  const cookieStore = await cookies();
  const raw = cookieStore.get("session")?.value;
  if (!raw) return null;
  try {
    return JSON.parse(raw) as {
      id: number;
      username: string;
      email: string;
      role: string;
    };
  } catch {
    return null;
  }
}

async function setSession(user: {
  id: number;
  username: string;
  email: string;
  role: string;
}) {
  const cookieStore = await cookies();
  cookieStore.set("session", JSON.stringify(user), {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
  redirect("/login");
}

// ===== AUTH =====
export async function registerUser(formData: FormData) {
  const username = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!username || !email || !password) {
    throw new Error("Semua field wajib diisi");
  }

  try {
    const [existing]: any = await db.query(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );
    if (existing.length > 0) {
      throw new Error("Email sudah terdaftar");
    }

    await db.query(
      "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, 'user')",
      [username, email, password]
    );
  } catch (error: any) {
    console.error("Register error:", error);
    if (error.message === "Email sudah terdaftar") throw error;
    throw new Error("Email sudah terdaftar atau terjadi kesalahan database.");
  }

  redirect("/home");
}

export async function loginUser(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const [rows]: any = await db.query(
    "SELECT * FROM users WHERE email = ? AND password = ?",
    [email, password]
  );

  if (!rows || rows.length === 0) {
    throw new Error("Email atau password salah!");
  }

  const user = rows[0];
  await setSession({
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
  });

  // Jika admin, arahkan ke /admin (pastikan foldernya ada, atau ubah ke /admin/products)
  if (user.role === "admin") redirect("/admin");
  redirect("/home");
}

// ===== CATEGORIES =====
export async function getTopCategories() {
  try {
    const [rows]: any = await db.query(
      "SELECT * FROM categories ORDER BY animal_type, name"
    );

    return [
      {
        id: "anjing",
        name: "Anjing",
        slug: "dog",
        type: "dog",
        children: rows
          .filter((r: any) => r.animal_type === "anjing")
          .map((r: any) => ({ id: r.id, name: r.name, slug: r.name })),
      },
      {
        id: "kucing",
        name: "Kucing",
        slug: "cat",
        type: "cat",
        children: rows
          .filter((r: any) => r.animal_type === "kucing")
          .map((r: any) => ({ id: r.id, name: r.name, slug: r.name })),
      },
    ];
  } catch (error) {
    console.error("Get categories error:", error);
    return [];
  }
}

export async function getCategories() {
  try {
    const [rows]: any = await db.query(
      "SELECT * FROM categories ORDER BY animal_type, name"
    );
    return rows;
  } catch {
    return [];
  }
}

export async function createCategory(formData: FormData) {
  const session = await getSession();
  if (!session || session.role !== "admin") throw new Error("Unauthorized");

  const animal_type = formData.get("animal_type") as string;
  const name = formData.get("name") as string;
  await db.query("INSERT INTO categories (animal_type, name) VALUES (?, ?)", [
    animal_type,
    name,
  ]);
}

export async function deleteCategory(id: number) {
  const session = await getSession();
  if (!session || session.role !== "admin") throw new Error("Unauthorized");
  await db.query("DELETE FROM categories WHERE id = ?", [id]);
}

// ===== PRODUCTS (anti-dobel) =====
export async function getProducts(categoryId?: number) {
  try {
    let query = `
      SELECT 
        p.id, p.name, p.description, p.price, p.stock, p.image, p.category_id,
        c.name as categoryName, c.animal_type as animalType
      FROM products p
      INNER JOIN categories c ON p.category_id = c.id
    `;
    const params: any[] = [];

    if (categoryId) {
      query += ` WHERE p.category_id = ?`;
      params.push(categoryId);
    }
    query += ` ORDER BY p.id DESC`;

    const [rows]: any = await db.query(query, params);

    const map = new Map();
    for (const r of rows) {
      if (!map.has(r.id)) {
        map.set(r.id, {
          id: r.id,
          name: r.name,
          description: r.description,
          price: Number(r.price),
          stock: r.stock,
          imageUrl: r.image,
          categoryId: r.category_id,
          category: {
            name: r.categoryName,
            type: r.animalType,
            parent: {
              name: r.animalType === "anjing" ? "Anjing" : "Kucing",
              slug: r.animalType === "anjing" ? "dog" : "cat",
            },
          },
        });
      }
    }
    return Array.from(map.values());
  } catch (error) {
    console.error("Get products error:", error);
    return [];
  }
}

export async function createProduct(formData: FormData) {
  const session = await getSession();
  if (!session || session.role !== "admin") throw new Error("Unauthorized");

  await db.query(
    "INSERT INTO products (category_id, name, description, price, stock, image) VALUES (?, ?, ?, ?, ?, ?)",
    [
      Number(formData.get("categoryId")),
      formData.get("name") as string,
      (formData.get("description") as string) || null,
      Number(formData.get("price")),
      Number(formData.get("stock")) || 0,
      (formData.get("imageUrl") as string) || null,
    ]
  );
}

export async function deleteProduct(id: number) {
  const session = await getSession();
  if (!session || session.role !== "admin") throw new Error("Unauthorized");
  await db.query("DELETE FROM products WHERE id = ?", [id]);
}

// ===== CHECKOUT (stok berkurang) =====
export async function checkout(items: { productId: number; qty: number }[]) {
  const session = await getSession();
  if (!session) throw new Error("Harus login dulu");
  if (!items.length) throw new Error("Keranjang kosong");

  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    let total = 0;
    const orderItems: { productId: number; qty: number; price: number }[] = [];

    for (const item of items) {
      const [rows]: any = await conn.query(
        "SELECT * FROM products WHERE id = ? FOR UPDATE",
        [item.productId]
      );
      const product = rows[0];
      if (!product) throw new Error("Produk tidak ditemukan");
      if (product.stock < item.qty) {
        throw new Error(`Stok ${product.name} tidak cukup`);
      }
      const price = Number(product.price);
      total += price * item.qty;
      orderItems.push({ productId: item.productId, qty: item.qty, price });
    }

    const [orderResult]: any = await conn.query(
      "INSERT INTO orders (user_id, total_price, status) VALUES (?, ?, 'paid')",
      [session.id, total]
    );
    const orderId = orderResult.insertId;

    for (const item of orderItems) {
      await conn.query(
        "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)",
        [orderId, item.productId, item.qty, item.price]
      );
      await conn.query("UPDATE products SET stock = stock - ? WHERE id = ?", [
        item.qty,
        item.productId,
      ]);
    }

    await conn.commit();
    return { success: true };
  } catch (err: any) {
    await conn.rollback();
    throw new Error(err.message || "Checkout gagal");
  } finally {
    conn.release();
  }
}

// Ambil detail satu produk berdasarkan ID untuk form Edit
export async function getProductById(id: number) {
  try {
    const [rows]: any = await db.query("SELECT * FROM products WHERE id = ?", [id]);
    if (rows.length === 0) return null;
    return rows[0];
  } catch (error) {
    console.error("Get product by ID error:", error);
    return null;
  }
}

// Update data produk
export async function updateProduct(id: number, formData: FormData) {
  const session = await getSession();
  if (!session || session.role !== "admin") throw new Error("Unauthorized");

  const name = formData.get("name") as string;
  const price = Number(formData.get("price"));
  const stock = Number(formData.get("stock"));
  const categoryId = Number(formData.get("categoryId"));
  const description = (formData.get("description") as string) || null;
  const imageUrl = (formData.get("imageUrl") as string) || null;

  await db.query(
    "UPDATE products SET category_id = ?, name = ?, description = ?, price = ?, stock = ?, image = ? WHERE id = ?",
    [categoryId, name, description, price, stock, imageUrl, id]
  );
}