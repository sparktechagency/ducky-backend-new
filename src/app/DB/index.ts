import config from "../config";
import { User } from "../modules/user/user.models";



const superAdminData = {
  fullName: 'Super Admin',
  email: config.super_admin.email,
  password: config.super_admin.password,
  role: 'super_admin',
};



export const createSuperAdmin = async()=>{

    const existSuperAdmin = await User.findOne({ email: superAdminData.email });
    if (!existSuperAdmin) {
      const user = await User.create(superAdminData);

      if (!user) {
        throw new Error('Super Admin creation failed!');
      }
      console.log('Super Admin created successfully');
    } else {
      console.log('Super Admin already exists');
    }

}