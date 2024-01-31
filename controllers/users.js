
import User from "../models/user.js";

export async function renderSignupForm(req, res) {
  res.render("users/signup");
}

export async function signup(req, res) {
  try {
      const { username, password, email } = req.body;
    const user = new User({ email, password,username });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, (err) => {
      if (err) return next(err)
      req.flash("success", "Welcome To Yelp Camp!");
      res.redirect("/campgrounds");
    });
  } catch ( e ) {
    req.flash("error", e.message);
    res.redirect("signup");
  }
  
}

export async function renderLogin(req, res) {
  res.render("users/login");
}

export async function login(req, res) {
  req.flash("success", "Welcome Back!");
  const redirectUrl = res.locals.returnTo || "/campgrounds";
  res.redirect(redirectUrl);
}

export async function logout(req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash("success", "Goodbye!");
    res.redirect("/campgrounds");
  });
}
