import mongoose, { ConnectOptions } from "mongoose"
import config from "config"

export interface DatabaseConfig {
    uri: string
}

const uri = config.get<DatabaseConfig>("Database").uri;

const connectDB = async () => {
	try {
		await mongoose.connect(uri as unknown as string, {
			useUnifiedTopology: true,
			useNewUrlParser: true,
		} as ConnectOptions)
	}
	catch (err) {
		console.error(err);
	}
};

export default connectDB; 