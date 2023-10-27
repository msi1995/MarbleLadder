
export const handleLogout = (navigate, cookies) => {
  cookies.remove("MarbleToken", { path: "/" });
  localStorage.clear();
  navigate("/");
  window.location.reload();
};

export const round =(value, precision) => {
  var multiplier = Math.pow(10, precision || 0);
  return Math.round(value * multiplier) / multiplier;
}