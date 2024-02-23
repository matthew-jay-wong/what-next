'use client';

import searchForMovies from "@/api/tmdb/searchForMovies";
import { BaseValueType, DebounceSelect } from "../SearchSelect";
import { useState } from "react";

export default function SelectMovie() {

	const [selectedMovie, setSelectedMovie] = useState<BaseValueType>();

	return (
		<DebounceSelect
			onChange={(e) => setSelectedMovie(e as BaseValueType)}
			placeholder="Select Movie"
			fetchOptions={searchForMovies}
			style={{ width: '500px' }}
		/>
	);
}
