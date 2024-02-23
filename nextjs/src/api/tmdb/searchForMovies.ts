'use server'

import { BaseValueType } from "@/components/SearchSelect";
import { operations } from "@/types/tmdbAPI";
import { tmdbApiClient } from "@/utils/httpApiClients";

export default async function searchForMovies({ query, page = 1 }: { query: string; page?: number }): Promise<BaseValueType[]> {
	try {
		const url = '/3/search/movie';
		const res =
			await tmdbApiClient.get<operations['search-movie']['responses']['200']['content']['application/json']>(
				url,
				{ params: { query, page } }
			);

		return res.data.results?.map((res) => ({
			key: `${res.id}`,
			label: `${res.title} (${res.release_date})` || '',
			value: res.id || ''
		})) || [];
	} catch (e) {
		throw e;
	}
}
