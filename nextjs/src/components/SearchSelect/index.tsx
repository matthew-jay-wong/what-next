'use client';

import { Select, SelectProps, Spin } from "antd";
import { ReactNode, useEffect } from "react";
import useDebounceSelect from "./useDebounceSelect";

export interface BaseValueType {
	key?: string | undefined;
	label: ReactNode;
	value: string | number;
}

export type FetchOptions<ValueType> = (params: {
	query: string;
	page?: number;
}) => Promise<ValueType[]>;

export interface DebounceSelectProps<ValueType = any>
	extends Omit<SelectProps<ValueType | ValueType[]>, 'options' | 'children'> {
	fetchOptions: FetchOptions<ValueType>;
	debounceTimeout?: number;
}

const CenteredLoadingSpinner = () => (
	<div className="flex justify-center p-4">
		<Spin size="small" />
	</div>
);

export function DebounceSelect<ValueType extends BaseValueType>({
	fetchOptions,
	debounceTimeout = 800,
	...props
}: DebounceSelectProps<ValueType>) {
	const {
		fetching,
		options,
		debounceFetcher,
		onPopupScroll,
		onBlur,
		reset,
	} = useDebounceSelect({ fetchOptions, debounceTimeout });

	useEffect(() => {
		console.log(options);
	}, [options])

	return (
		<Select
			filterOption={false}
			virtual
			onSearch={debounceFetcher}
			showSearch
			notFoundContent={fetching ? <CenteredLoadingSpinner /> : null}
			onPopupScroll={onPopupScroll}
			onBlur={onBlur}
			dropdownRender={(menu: ReactNode) => (
				<>
					{options.length > 0 ? menu : null}
					{fetching ? <CenteredLoadingSpinner /> : null}
				</>
			)}
			{...props}
			onChange={(value, options) => {
				props.onChange && props.onChange(value, options);
				reset();
			}}
			options={options}
		/>
	);
}
