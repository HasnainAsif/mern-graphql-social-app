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

export const useTablePagination = ({
  data = [],
  itemsPerScreen = ITEMS_PER_SCREEN,
}) => {
  //Page No. e.g; 1 or 2 or 3 etc
  const [pageNo, setPageNo] = useState(1);
  //Total No Of Pages
  const [pagesCount, setPagesCount] = useState(0);

  const handleChangeScreenNo = (value) => {
    setPageNo(value);
  };
  const countData = data?.length;

  //No Of Pages
  useEffect(() => {
    if (countData % itemsPerScreen === 0) {
      setPagesCount(Math.floor(countData / itemsPerScreen));
    } else {
      setPagesCount(Math.floor(countData / itemsPerScreen) + 1);
    }
  }, [countData]);

  const fromPageNo = pageNo * itemsPerScreen - itemsPerScreen;
  const toPageNo = itemsPerScreen * pageNo;
  const paginatedData = data?.slice(fromPageNo, toPageNo);

  return {
    pageNo,
    pagesCount,
    paginatedData: paginatedData || [],
    handleChangeScreenNo,
    lastPage: pagesCount === pageNo,
  };
};

export const useCursorPagination = ({
  data = [],
  itemsPerScreen = ITEMS_PER_SCREEN,
}) => {
  //Page No. e.g; 1 or 2 or 3 etc
  const [pageNo, setPageNo] = useState(1);
  //Total No Of Pages
  const [pagesCount, setPagesCount] = useState(0);

  const handleChangeScreenNo = (value) => {
    setPageNo(value);
  };
  const countData = data?.length;

  //No Of Pages
  useEffect(() => {
    if (countData % itemsPerScreen === 0) {
      setPagesCount(Math.floor(countData / itemsPerScreen));
    } else {
      setPagesCount(Math.floor(countData / itemsPerScreen) + 1);
    }
  }, [countData]);

  const fromPageNo = pageNo * itemsPerScreen - itemsPerScreen;
  const toPageNo = itemsPerScreen * pageNo;
  const paginatedData = data?.slice(fromPageNo, toPageNo);

  return {
    pageNo,
    pagesCount,
    paginatedData: paginatedData || [],
    handleChangeScreenNo,
    lastPage: pagesCount === pageNo,
  };
};
