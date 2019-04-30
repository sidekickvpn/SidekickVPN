import { describe } from 'riteway';
import render from 'riteway/render-component';
import React from 'react';
import Filter from '../src/components/filter/Filter';

describe('Filter component', async assert => {
	const createFilter = () => render(<Filter />);

	{
		const FilterComponent = createFilter();

		assert({
			given: 'a filter component',
			should: 'render the component',
			actual: FilterComponent('h3')
				.html()
				.trim(),
			expected: 'Filter Training'
		});

		assert({
			given: 'a filter component',
			should: 'render the buttons',
			actual: FilterComponent('button')
				.map((i, ele) =>
					FilterComponent(ele)
						.text()
						.trim()
				)
				.get(),
			expected: ['Record Positive Traffic', 'Record Negative Traffic']
		});
	}
});
