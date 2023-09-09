import { useEffect, useState } from 'react';

const ITEMS_PER_SCREEN = 5;

export const useForm = (callback, initialState = {}) => {
  const [formData, setFormData] = useState(initialState);

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    callback();
  };

  return {
    onChange,
    onSubmit,
    formData,
  };
};

export const usePagination = ({
  data = [],
  itemsPerScreen = ITEMS_PER_SCREEN,
  totalNoOfData,
  type = 'frontend',
}) => {
  const [paginatedData, setPaginatedData] = useState(undefined);
  //Page No. e.g; 1 or 2 or 3 etc
  const [pageNo, setPageNo] = useState(1);
  //Total No Of Pages
  const [pagesCount, setPagesCount] = useState(0);

  const handleChangePageNo = (value, cb) => {
    setPageNo(value);

    if (cb) {
      const offset = value * itemsPerScreen - itemsPerScreen;
      cb({ offset });
    }
  };

  const countData = totalNoOfData ?? data?.length;

  //No Of Pages
  useEffect(() => {
    if (countData % itemsPerScreen === 0) {
      setPagesCount(Math.floor(countData / itemsPerScreen));
    } else {
      setPagesCount(Math.floor(countData / itemsPerScreen) + 1);
    }
  }, [countData, itemsPerScreen]);

  // Paginated Data
  useEffect(() => {
    if (type === 'backend') {
      setPaginatedData(data);
      return;
    }

    // type = 'frontend'
    const from = pageNo * itemsPerScreen - itemsPerScreen;
    const to = itemsPerScreen * pageNo;
    setPaginatedData(data?.slice(from, to));
  }, [pageNo, data, itemsPerScreen, type]);

  return {
    pageNo,
    pagesCount,
    paginatedData: paginatedData || [],
    handleChangePageNo,
    lastPage: pagesCount === pageNo,
  };
};
