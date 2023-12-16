export const isAuthenticatedGuard = (to, from, next) => {
  const token = localStorage.getItem("access");
  
  if (token) {
    console.log(" ===>> AUHT <<===");
    next();
  } else {
    console.log(" ===> NO AUTH <<=== ");
    next({ name: "auth-login" });
  }
};
export const isAuthenticatedSurvey = (to, from, next) => {
  const token = localStorage.getItem("access");
  
  if (token) {
    console.log(" LOGEADO - AL SURVEY - ");
    next({ name: "list-surveys" });
  } else {
    console.log(" NO LOGEADO - AL LOGIN - ");
    next();
  }
};

