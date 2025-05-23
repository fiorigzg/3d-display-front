import "app/globals.scss";

import Header from "components/Header";

export const metadata = {
  title: "PD",
  description: "Main page",
};

export default function Layout({ children }) {
  return (
    <div>
      <Header />
      {children}
    </div>
  );
}
