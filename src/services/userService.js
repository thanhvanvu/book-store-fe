import axios from "../utils/axios-customize";

const handleRegister = (input) => {
  const options = {
    method: "post",
    url: "/api/v1/user/register",
    data: input,
  };

  return axios(options);
};

const handleLogin = (input) => {
  const options = {
    method: "post",
    url: "/api/v1/auth/login",
    data: input,
  };

  return axios(options);
};

const handleFetchAccount = () => {
  const token = localStorage.getItem("access_token");
  const options = {
    method: "get",
    url: "/api/v1/auth/account",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  return axios(options);
};

const handleLogout = () => {
  const token = localStorage.getItem("access_token");
  const options = {
    method: "post",
    url: "/api/v1/auth/logout",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  return axios(options);
};

const handleGetAllUsers = () => {
  const token = localStorage.getItem("access_token");
  const options = {
    method: "get",
    url: "/api/v1/user",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  return axios(options);
};

const handleGetUserWithPaginate = (pagination) => {
  const token = localStorage.getItem("access_token");
  const options = {
    method: "get",
    url: `/api/v1/user?current=${pagination.current}&pageSize=${pagination.pageSize}`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  return axios(options);
};

const handleSearchUserWithPaginate = (pagination, searchInput) => {
  let fullname;
  let email;
  let phone;

  if (searchInput.fullName === "") {
    fullname = "";
  } else {
    fullname = `/${searchInput.fullName}/i`;
  }

  if (searchInput.email === "") {
    email = "";
  } else {
    email = `/${searchInput.email}/i`;
  }

  if (searchInput.phone === "") {
    phone = "";
  } else {
    phone = `/${searchInput.phone}/i`;
  }

  const token = localStorage.getItem("access_token");
  const options = {
    method: "get",
    url: `/api/v1/user?current=${pagination.current}&pageSize=${pagination.pageSize}&fullName=${fullname}&email=${email}&phone=${phone}`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  return axios(options);
};

const handleSortUserWithPaginate = (pagination, query) => {
  const token = localStorage.getItem("access_token");
  const options = {
    method: "get",
    url: `/api/v1/user?current=${pagination.current}&pageSize=${pagination.pageSize}&sort=${query}`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  return axios(options);
};

const handleCreateNewUser = (userInput) => {
  const token = localStorage.getItem("access_token");
  const options = {
    method: "post",
    url: `/api/v1/user`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: userInput,
  };

  return axios(options);
};

const handleCreateBulkUser = (userInput) => {
  const token = localStorage.getItem("access_token");
  const options = {
    method: "post",
    url: `/api/v1/user/bulk-create`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: userInput,
  };

  return axios(options);
};

const handleUpdateUser = (userInput) => {
  const token = localStorage.getItem("access_token");
  const options = {
    method: "put",
    url: `/api/v1/user`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: userInput,
  };

  return axios(options);
};

const handleDeleteUser = (userId) => {
  const token = localStorage.getItem("access_token");
  const options = {
    method: "delete",
    url: `/api/v1/user/${userId}`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  return axios(options);
};

const handlePlaceOrder = (orderInput) => {
  const token = localStorage.getItem("access_token");
  const options = {
    method: "post",
    url: `/api/v1/order`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: orderInput,
  };

  return axios(options);
};

const handleUploadAvatar = (fileImg) => {
  const bodyFormData = new FormData();
  bodyFormData.append("fileImg", fileImg);

  const token = localStorage.getItem("access_token");
  const options = {
    method: "post",
    url: `/api/v1/file/upload`,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
      "upload-type": "avatar",
    },
    data: bodyFormData,
  };

  return axios(options);
};

const handleRefreshToken = () => {
  const options = {
    method: "get",
    url: `/api/v1/auth/refresh`,
  };

  return axios(options);
};

const handleChangePassword = (passwordInfo) => {
  const token = localStorage.getItem("access_token");
  const options = {
    method: "post",
    url: `/api/v1/user/change-password`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: passwordInfo,
  };

  return axios(options);
};

const handleGetDashboardAdmin = () => {
  const token = localStorage.getItem("access_token");
  const options = {
    method: "get",
    url: `/api/v1/database/dashboard`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  return axios(options);
};

export {
  handleRegister,
  handleLogin,
  handleFetchAccount,
  handleLogout,
  handleGetAllUsers,
  handleGetUserWithPaginate,
  handleSearchUserWithPaginate,
  handleSortUserWithPaginate,
  handleCreateNewUser,
  handleCreateBulkUser,
  handleUpdateUser,
  handleDeleteUser,
  handlePlaceOrder,
  handleUploadAvatar,
  handleRefreshToken,
  handleChangePassword,
  handleGetDashboardAdmin,
};
