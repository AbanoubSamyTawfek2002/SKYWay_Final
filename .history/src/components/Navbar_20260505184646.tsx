import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Plane,
  Hotel,
  User,
  Globe,
  LogOut,
  LayoutDashboard,
  Sun,
  Moon,
  Menu,
  Heart,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { useCurrency } from "../contexts/CurrencyContext";
import { CurrencySelector } from "./CurrencySelector";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export const Navbar: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "ar" : "en";
    i18n.changeLanguage(newLang);
    document.dir = newLang === "ar" ? "rtl" : "ltr";
  };

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40 w-full">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <div className="flex items-center gap-10">
          <NavLink
            to="/"
            className="flex items-center gap-3 font-black text-2xl tracking-tighter uppercase italic"
          >
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center transform rotate-12 shadow-lg group">
              <Plane className="text-primary-foreground transform -rotate-12 transition-transform group-hover:scale-110" />
            </div>
            <span className="hidden sm:inline">SkyWay</span>
          </NavLink>

          <div className="hidden lg:flex items-center gap-8 text-sm font-bold uppercase tracking-widest">
            <NavLink
              to="/flights"
              className={({ isActive }) =>
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-primary transition-colors"
              }
            >
              {t("flights")}
            </NavLink>
            <NavLink
              to="/hotels"
              className={({ isActive }) =>
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-primary transition-colors"
              }
            >
              {t("hotels")}
            </NavLink>
            <NavLink
              to="/cars"
              className={({ isActive }) =>
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-primary transition-colors"
              }
            >
              {t("cars") || "CARS"}
            </NavLink>
            <NavLink
              to="/journals"
              className={({ isActive }) =>
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-primary transition-colors"
              }
            >
              {t("journal")}
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-primary transition-colors"
              }
            >
              {t("About Us")}
            </NavLink>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <div className="hidden md:flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full w-10 h-10"
            >
              {theme === "light" ? (
                <Moon className="h-4 w-4" />
              ) : (
                <Sun className="h-4 w-4" />
              )}
            </Button>

            <CurrencySelector />

            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLanguage}
              className="gap-2 font-black uppercase tracking-tighter"
            >
              <Globe className="h-4 w-4 text-primary" />
              <span>{i18n.language}</span>
            </Button>
          </div>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "gap-2 rounded-full",
                )}
              >
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">{user.name}</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={() => navigate("/my-bookings")}>
                  <Hotel className="mr-2 h-4 w-4" />
                  <span>{t("my_bookings")}</span>
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => navigate("/wishlist")}>
                  <Heart className="mr-2 h-4 w-4" />
                  <span>My Wishlist</span>
                </DropdownMenuItem>

                {(user.role === "admin" || user.role === "support") && (
                  <DropdownMenuItem onClick={() => navigate("/admin")}>
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    <span>{t("admin_dashboard")}</span>
                  </DropdownMenuItem>
                )}

                <DropdownMenuItem
                  onClick={() => {
                    logout();
                    navigate("/");
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>{t("logout")}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Button
                variant="ghost"
                className="rounded-full"
                onClick={() => navigate("/login")}
              >
                {t("login")}
              </Button>
              <Button
                className="rounded-full"
                onClick={() => navigate("/register")}
              >
                {t("register")}
              </Button>
            </div>
          )}

          <Sheet>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden rounded-full h-10 w-10"
                />
              }
            >
              <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle className="text-left font-black tracking-tighter uppercase italic text-2xl">
                  SkyWay
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-6 mt-10">
                <div className="flex flex-col gap-4">
                  <NavLink
                    to="/flights"
                    className="text-xl font-black uppercase tracking-widest hover:text-primary transition-colors"
                  >
                    {t("flights")}
                  </NavLink>
                  <NavLink
                    to="/hotels"
                    className="text-xl font-black uppercase tracking-widest hover:text-primary transition-colors"
                  >
                    {t("hotels")}
                  </NavLink>
                  <NavLink
                    to="/cars"
                    className="text-xl font-black uppercase tracking-widest hover:text-primary transition-colors"
                  >
                    {t("cars") || "CARS"}
                  </NavLink>
                  <NavLink
                    to="/journals"
                    className="text-xl font-black uppercase tracking-widest hover:text-primary transition-colors"
                  >
                    {t("journal")}
                  </NavLink>
                  {user && (
                    <NavLink
                      to="/wishlist"
                      className="text-xl font-black uppercase tracking-widest hover:text-primary transition-colors"
                    >
                      My Wishlist
                    </NavLink>
                  )}
                </div>

                <div className="h-px bg-border my-2" />

                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <span className="font-bold uppercase tracking-widest text-xs">
                      Appearance
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={toggleTheme}
                      className="rounded-full gap-2 font-bold uppercase tracking-widest text-[10px]"
                    >
                      {theme === "light" ? (
                        <>
                          <Moon className="h-3 w-3" /> Dark
                        </>
                      ) : (
                        <>
                          <Sun className="h-3 w-3" /> Light
                        </>
                      )}
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold uppercase tracking-widest text-xs">
                      Language
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={toggleLanguage}
                      className="rounded-full gap-2 font-bold uppercase tracking-widest text-[10px]"
                    >
                      <Globe className="h-3 w-3" />{" "}
                      {i18n.language.toUpperCase()}
                    </Button>
                  </div>
                </div>

                {!user && (
                  <div className="flex flex-col gap-3 mt-4">
                    <Button
                      variant="outline"
                      className="w-full rounded-full h-12 font-bold uppercase tracking-widest"
                      onClick={() => navigate("/login")}
                    >
                      {t("login")}
                    </Button>
                    <Button
                      className="w-full rounded-full h-12 font-bold uppercase tracking-widest"
                      onClick={() => navigate("/register")}
                    >
                      {t("register")}
                    </Button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};
