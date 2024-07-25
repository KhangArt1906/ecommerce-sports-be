const adminModel = require("../models/adminModel");
const providerCustomerModel = require("../models/Chat/providerCustomerModel");
const providerModel = require("../models/providerModel");
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

  provider_login = async (req, res) => {
    const { email, password } = req.body;

    try {
      const provider = await providerModel
        .findOne({
          email,
        })
        .select("+password");

      if (provider) {
        // Check match with bcrypt
        const matchProvider = await bcrpty.compare(password, provider.password);
        if (matchProvider) {
          const token = await createToken({
            id: provider.id,
            role: provider.role,
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

  provider_register = async (req, res) => {
    // Determine sign up provider with the information encompasses email, name, password
    const { email, name, password } = req.body;
    try {
      const getUser = await providerModel.findOne({
        email,
      });
      if (getUser) {
        responseReturn(res, 404, { error: "Email already existed" });
      } else {
        const provider = await providerModel.create({
          name,
          email,
          password: await bcrpty.hash(password, 10),
          method: "manually",
          shopInformation: {},
        });
        await providerCustomerModel.create({
          myID: provider.id,
        });

        const token = await createToken({
          id: provider.id,
          role: provider.role,
        });

        res.cookie("accessToken", token, {
          expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        });
        responseReturn(res, 201, { token, message: "Register Success" });
      }
    } catch (error) {
      responseReturn(res, 500, { message: "Internal Server Error" });
    }
  };

  //Check User Method
  getUser = async (req, res) => {
    const { id, role } = req;

    try {
      if (role === "admin") {
        const user = await adminModel.findById(id);
        responseReturn(res, 200, { userInformation: user });
      } else {
        const provider = await providerModel.findById(id);
        responseReturn(res, 200, { userInformation: provider });
      }
    } catch (error) {
      responseReturn(res, 500, { error: "Internal Server Error" });
    }
  };
}

module.exports = new authControllers();
