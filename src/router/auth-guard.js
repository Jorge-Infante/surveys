const isAuthenticatedGuard = (to, from, next) => {
  const token = localStorage.getItem("access");
  
  if (token) {
    console.log(" ===>> AUHT <<===");
    next();
  } else {
    console.log(" ===> NO AUTH <<=== ");
    next({ name: "auth-login" });
  }
};

export default isAuthenticatedGuard;
