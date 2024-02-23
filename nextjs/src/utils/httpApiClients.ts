import axios from "axios";
import { env } from "./env";

export const tmdbApiClient = axios.create({
	baseURL: env.tmdbAPI.baseURL,
	headers: {
		'accept': 'application/json',
		'Authorization': `Bearer ${env.tmdbAPI.bearerToken}`
	}
});
