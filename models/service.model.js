// import mongoose from "mongoose";
// import slugify from "slugify";

// const serviceSchema = new mongoose.Schema(
//   {
//     title: {
//       type: String,
//       required: true,
//       trim: true,
//     },

//     slug: {
//       type: String,
//       unique: true,
//     },

//     description: {
//       type: String,
//       required: true,
//     },

//     icon: {
//       type: String,
//       required: true,
//     },

//     iconColor: {
//       type: String,
//       default: "#06b6d4",
//     },

//     tags: [
//       {
//         type: String,
//       },
//     ],

//     displayOrder: {
//       type: Number,
//       default: 0,
//     },

//     isActive: {
//       type: Boolean,
//       default: true,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// serviceSchema.pre("validate", function (next) {
//   if (this.title && !this.slug) {
//     this.slug = slugify(this.title, { lower: true, strict: true });
//   }
//   next();
// });

// export default mongoose.model("Service", serviceSchema);







// import mongoose from "mongoose";
// import slugify from "slugify";

// // Technology Sub-schema (taaki validation clear rahe)
// const technologySchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//     trim: true,
//   },
//   icon: {
//     type: String,
//     required: true,
//     trim: true,
//   }
// }, { _id: false }); // _id: false se technologies array ke andar faltu ki extra IDs generate nahi hongi

// // Highlight Sub-schema (Image 1 ke grid content ke liye)
// const highlightSchema = new mongoose.Schema({
//   title: {
//     type: String,
//     required: true,
//     trim: true,
//   },
//   desc: {
//     type: String,
//     required: true,
//     trim: true,
//   }
// }, { _id: false });

// const serviceSchema = new mongoose.Schema(
//   {
//     title: {
//       type: String,
//       required: true,
//       trim: true,
//     },

//     slug: {
//       type: String,
//       unique: true,
//     },

//     category: {
//       type: String,
//       required: true,
//       trim: true,
//     },

//     description: {
//       type: String,
//       required: true,
//     },

//     icon: {
//       type: String,
//       required: true,
//     },

//     iconColor: {
//       type: String,
//       default: "#06b6d4",
//     },

//     image: {
//       type: String,
//       trim: true,
//     },

//     features: [
//       {
//         type: String,
//         trim: true,
//       },
//     ],

//     // Image 1 content layout ke liye custom sub-schema
//     highlights: [highlightSchema],

//     // Image 2 tech layout ke liye dynamic nested object structure
    
//     technologies: [technologySchema],

//     tags: [
//       {
//         type: String,
//         trim: true,
//       },
//     ],

//     displayOrder: {
//       type: Number,
//       default: 0,
//     },

//     isActive: {
//       type: Boolean,
//       default: true,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// // Slug auto-generation logic
// serviceSchema.pre("validate", function (next) {
//   if (this.title && !this.slug) {
//     this.slug = slugify(this.title, { lower: true, strict: true });
//   }
//   next();
// });

// export default mongoose.model("Service", serviceSchema);








import mongoose from "mongoose";
import slugify from "slugify";

const highlightSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    desc: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false }
);

const technologySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      default: "",
    },
  },
  { _id: false }
);

const serviceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },

    category: {
      type: String,
      default: "",
    },

    description: {
      type: String,
      required: true,
    },

    icon: {
      type: String,
      required: true,
    },

    image: {
      type: String,
      default: "",
    },

    highlights: {
      type: [highlightSchema],
      default: [],
    },

    technologies: {
      type: [technologySchema],
      default: [],
    },

    displayOrder: {
      type: Number,
      default: 0,
    },
    featured: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// serviceSchema.pre("save", function () {
//   if (!this.slug) {
//     this.slug = slugify(this.title, {
//       lower: true,
//       strict: true,
//     });
//   }

//   // next();
// });

serviceSchema.pre("save", function () {
  if (!this.slug) {
    this.slug = slugify(this.title, {
      lower: true,
      strict: true,
    });
  }
});

export default mongoose.model("Service", serviceSchema);
