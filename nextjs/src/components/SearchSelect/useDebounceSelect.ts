import { useState, useRef, useMemo, UIEvent, FocusEvent } from 'react';
import { FetchOptions } from './index';
import debounce from 'lodash.debounce';

export default function useDebounceSelect<ValueType>({ fetchOptions, debounceTimeout }: {
	fetchOptions: FetchOptions<ValueType>;
	debounceTimeout: number;
}) {
	const [fetching, setFetching] = useState(false);
	const [options, setOptions] = useState<ValueType[]>([]);
	const [currentQuery, setCurrentQuery] = useState<string>('');
	const [currentPage, setCurrentPage] = useState(1);
	const fetchRef = useRef(0);

	const debounceFetcher = useMemo(() => {
		const loadOptions = (query: string) => {
			console.log(query);
			setCurrentQuery(query);
			setCurrentPage(1);

			fetchRef.current += 1;
			const fetchId = fetchRef.current;
			setOptions([]);
			if (query === '')
				return;

			setFetching(true);

			fetchOptions({ query: query, page: 1 })
				.then((newOptions) => {
					if (fetchId !== fetchRef.current) {
						// for fetch callback order
						return;
					}

					setOptions(newOptions);
					setFetching(false);
				});
		};

		return debounce(loadOptions, debounceTimeout);
	}, [debounceTimeout, fetchOptions]);

	const onPopupScroll = (e: UIEvent<HTMLDivElement>) => {
		e.persist();

		const { target } = e as any;
		if (target.scrollTop + target.offsetHeight !== target.scrollHeight)
			return;

		setCurrentPage(currentPage + 1)
		setFetching(true);
		fetchRef.current += 1;
		const fetchId = fetchRef.current;
		fetchOptions({ query: currentQuery, page: currentPage })
			.then((newOptions) => {
				if (fetchId !== fetchRef.current) {
					// for fetch callback order
					return;
				}

				setOptions([...options, ...newOptions]);
				setFetching(false);
			});
	};

	const reset = () => {
		setCurrentQuery('');
		setOptions([]);
	}

	const onBlur = (e: FocusEvent<HTMLElement>) => {
		e.persist();
		reset();
	}

	return {
		fetching,
		options,
		debounceFetcher,
		onPopupScroll,
		onBlur,
		reset,
	}
}
