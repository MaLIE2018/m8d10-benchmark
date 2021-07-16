import mongoose, { Model } from "mongoose";
import bcrypt from "bcrypt";
import { User } from "../../types/interfaces";

const { model, Schema } = mongoose;

interface UserModel extends Model<User> {
  checkCredentials(email: string, password: string): null | {};
}

const UserSchema = new Schema<User, UserModel>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  role: { type: String, required: true, enum: ["host", "guest"] },
  password: { type: String },
  refreshToken: { type: String, default: "token" },
});

UserSchema.pre("save", async function () {
  const newUser = this;
  if (newUser.isModified("password")) {
    newUser.password = await bcrypt.hash(newUser.password!, 10);
  }
});

UserSchema.methods.toJSON = function () {
  const user = this;
  const userObj = user.toObject();
  delete userObj.password;
  delete userObj.__v;
  delete userObj.refreshToken;
  return userObj;
};

UserSchema.static(
  "checkCredentials",
  async function checkCredentials(email, password) {
    const user = await this.findOne({ email });
    if (user) {
      const isMatch = await bcrypt.compare(password, user.password!);

      if (isMatch) return user;
      else return null;
    } else {
      return null;
    }
  }
);

export default model("user", UserSchema);
