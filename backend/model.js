// Define the Employee schema
const employeeSchema = new mongoose.Schema({
    Emp_ID: {
      type: String,
      required: true,
      unique: true
    },
    Emp_Name: {
      type: String,
      required: true
    },
    Gender: {
      type: String,
      required: true
    },
    Address: {
      type: String,
      required: true
    },
    Latitude: {
      type: Number,
      required: true
    },
    Longitude: {
      type: Number,
      required: true
    },
    Phone_Number: {
      type: String,
      required: true
    },
    Emergency_Number: {
      type: String,
      required: true
    },
  });
  
  // Create a model
  const Employee = mongoose.model('Employee', employeeSchema);
  