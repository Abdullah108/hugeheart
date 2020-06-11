import { Schema, model } from "mongoose";

const UserSchema: Schema = new Schema({
  // common
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  fullName: {
    type: String,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  salt: {
    type: String,
  },
  contactNumber: {
    type: String,
  },
  experiance: {
    type: String,
  },
  // BA
  title: {
    type: String,
  },
  assignTask: {
    type: String,
  },
  additionalNote: {
    type: String,
  },
  // Master Admin
  preferedLocation: {
    type: new Schema({
      city: {
        type: String,
      },
      state: {
        type: String,
      },
      country: {
        type: String,
      },
      postalCode: {
        type: String,
      },
    }),
  },
  exactLocation: {
    type: new Schema({
      streetAddress: {
        type: String,
      },
      addressLine1: {
        type: String,
      },
      addressLine2: {
        type: String,
      },
      city: {
        type: String,
      },
      state: {
        type: String,
      },
      country: {
        type: String,
      },
      postalCode: {
        type: String,
      },
    }),
  },
  workingWithStudent: {
    type: String,
  },
  workingWithStudentExpirationDate: {
    type: Date,
  },
  liscenceStartDate: {
    type: Date,
  },
  liscenceEndDate: {
    type: Date,
  },
  // teacher
  availibility: {
    type: [
      new Schema({
        label: {
          type: String,
        },
        value: {
          type: String,
        },
      }),
    ],
  },
  currentAddress: {
    type: String,
  },
  pastExperience: {
    type: [
      new Schema({
        duration: String,
        center: String,
      }),
    ],
  },
  educationDetails: {
    type: [
      new Schema({
        degree: String,
        university: String,
        percentage: {
          type: Number,
          default: 0,
        },
      }),
    ],
  },
  emergencyContactNumber: {
    type: String,
  },
  emergencyEmail: {
    type: String,
  },
  selectedSubjects: {
    type: [String],
  },
  studyProblems: {
    type: String,
  },
  resume: {
    type: String,
  },
  // students
  parentFirstName: {
    type: String,
  },
  parentLastName: {
    type: String,
  },
  address: {
    type: String,
  },
  year: {
    type: String,
  },
  estimateAmount: {
    type: Number,
    default: 0,
  },
  trialClass: {
    type: [Date],
  },
  masterAdminId: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  enrollmentStatus: {
    type: String,
    enum: ["enrolled", "not enrolled"],
    default: "not enrolled",
  },
  enrollmentDate: {
    type: Date,
  },
  subjects: {
    type: [String],
  },
  days: {
    type: [
      new Schema({
        day: String,
        hours: Number,
        time: String,
      }),
    ],
  },
  assignedTeacher: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  // common
  userRole: {
    type: String,
    enum: ["superadmin", "masteradmin", "teacher", "student", "brandamb"],
  },
  profileImageURL: {
    type: String,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  lastLogin: {
    type: Date,
  },
  loginCount: {
    type: Number,
  },
  loggedInIp: {
    type: String,
  },
  createdAt: {
    type: Date,
    //    default: Date.now,
  },
  updatedAt: {
    type: Date,
  },
  createdFor: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  updatedBy: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
});

//Remove vouchers related to users
UserSchema.pre("remove", function (this: any, next: any) {
  console.log("fasdfdsf", this);
  this.model("teacher_schedule").deleteMany(
    {
      $or: [
        {
          studentId: this._id,
        },
        {
          teacherId: this._id,
        },
      ],
    },
    next
  );
});

export const UserModel = model("user", UserSchema);
