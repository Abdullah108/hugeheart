import { UserModel } from "./../models";
import { encryptPassword, generateSalt } from "../common/password";
export const UserSeeder = () => {
  const SuperAdmin = [
    {
      firstName: "Super",
      lastName: "Admin",
      email: "superadmin@hugeheart.com",
      password: encryptPassword("123456", generateSalt()),
      userRole: "superadmin",
      isActive: true,
    },
  ];
  UserModel.findOne({
    email: "superadmin@hugeheart.com",
  }).then((data) => {
    if (!data) {
      UserModel.create(SuperAdmin).then((data) => {
        console.log("Super Added Successfully!", JSON.stringify(data));
      });
    } else {
      console.log(`Super Admin is already registered!`);
    }
  });
};
