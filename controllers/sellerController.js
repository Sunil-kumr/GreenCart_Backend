import jwt from "jsonwebtoken";

// =====================
// SELLER LOGIN
// =====================
export const sellerLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      email !== process.env.SELLER_EMAIL ||
      password !== process.env.SELLER_PASSWORD
    ) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("sellerToken", token, {
      httpOnly: true,
      secure: true,        // ✅ REQUIRED in production
      sameSite: "none",    // ✅ REQUIRED for cross-domain
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ success: true, message: "Logged In" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// =====================
// SELLER AUTH CHECK
// =====================
export const isSellerAuth = async (req, res) => {
  try {
    res.json({ success: true });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// =====================
// SELLER LOGOUT
// =====================
export const sellerLogout = async (req, res) => {
  try {
    res.clearCookie("sellerToken", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    res.json({ success: true, message: "Logged Out" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
