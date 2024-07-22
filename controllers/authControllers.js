const adminModel = require("../models/adminModel");
const { responseReturn } = require("../utilities/response");
const { createToken } = require("../utilities/token");
const bcrpty = require("bcrypt");

class authControllers {
  admin_login = async (req, res) => {
    const { email, password } = req.body;

    try {
      const admin = await adminModel
        .findOne({
          email,
        })
        .select("+password");

      if (admin) {
        // Check match with bcrypt
        const matchAdmin = await bcrpty.compare(password, admin.password);
        if (matchAdmin) {
          const token = await createToken({
            id: admin.id,
            role: admin.role,
          });

          res.cookie("accessToken", token, {
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 100),
          });
          responseReturn(res, 200, {
            token,
            message: "Login Success",
          });
        } else {
          responseReturn(res, 404, {
            error: "Password Wrong",
          });
        }
      } else {
        responseReturn(res, 404, { error: "Email not found" });
      }
    } catch (error) {
      responseReturn(res, 500, {
        error: error.message,
      });
    }
  };
  //Check User Method
  getUser = async (req, res) => {
    const { id, role } = req;

    try {
      if (role === "admin") {
        const user = await adminModel.findById(id);
        responseReturn(res, 200, { userInfo: user });
      } else {
        console.log("Seller info");
      }
    } catch (error) {
      console.log(error.message);
    }
  };
}

module.exports = new authControllers();
