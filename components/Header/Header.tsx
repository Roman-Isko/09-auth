// "use client";

// import Link from "next/link";
// import css from "./Header.module.css";
// import TagsMenu from "../TagsMenu/TagsMenu";

// export default function Header() {
//   return (
//     <header className={css.header}>
//       <Link href="/" aria-label="Home">
//         NoteHub
//       </Link>

//       <nav aria-label="Main Navigation">
//         <ul className={css.navigation}>
//           <li>
//             <Link href="/">Home</Link>
//           </li>
//           <li>
//             <TagsMenu />
//           </li>
//         </ul>
//       </nav>
//     </header>
//   );
// }

"use client";

import Link from "next/link";
import css from "./Header.module.css";
import TagsMenu from "../TagsMenu/TagsMenu";
import AuthNavigation from "../AuthNavigation/AuthNavigation";

export default function Header() {
  return (
    <header className={css.header}>
      <Link href="/" aria-label="Home" className={css.logo}>
        NoteHub
      </Link>

      <nav aria-label="Main Navigation">
        <ul className={css.navigation}>
          {/* Головна сторінка */}
          <li className={css.navigationItem}>
            <Link href="/" prefetch={false} className={css.navigationLink}>
              Home
            </Link>
          </li>

          {/* Меню тегів */}
          <li className={css.navigationItem}>
            <TagsMenu />
          </li>

          {/* AuthNavigation додає свої <li> */}
          <AuthNavigation />
        </ul>
      </nav>
    </header>
  );
}
