import React, { useState } from 'react';
import { Dropdown } from 'semantic-ui-react';

const SelectPaginationSide = () => {
  const PAGINATION_SIDE = {
    FRONTEND: 'frontend',
    BACKEND: 'backend',
  };
  const [paginationSide, setPaginationSide] = useState(
    PAGINATION_SIDE.FRONTEND
  );

  const onChangePaginationSide = (e, { value }) => {
    setPaginationSide(value);
  };

  return {
    paginationSide,
    component: (
      <div>
        <Dropdown
          fluid
          defaultValue={PAGINATION_SIDE.FRONTEND}
          selection
          onChange={onChangePaginationSide}
          options={[
            {
              key: 'fp',
              value: PAGINATION_SIDE.FRONTEND,
              text: 'Frontend Pagination',
            },
            {
              key: 'bp',
              value: PAGINATION_SIDE.BACKEND,
              text: 'Backend Pagination',
            },
          ]}
        />
      </div>
    ),
  };
};

export default SelectPaginationSide;
