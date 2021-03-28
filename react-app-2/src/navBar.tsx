import { observer } from "mobx-react-lite";
import { useStore } from "./__store/root";
import * as React from "react";
import { cx } from "@emotion/css";
import tw from "twin.macro";
import styled from "@emotion/styled/macro";

export const NavBar = observer(() => {
  const {
    router: { routes },
    numberedPages,
  } = useStore();
  const height = 50;

  return (
    <>
      <div tw="h-20" />
      <$NavBar>
        <$Link
          href={`#${routes.homePage.toPath({})}`}
          className={cx({ active: routes.numberedPages.isActive })}
        >
          Home
        </$Link>
        <$Link
          tw="w-80"
          href={`#${routes.numberedPages.toPath({
            language: "en",
            page: "1",
          })}`}
          className={cx({ active: routes.numberedPages.isActive })}
        >
          Page By Number ({numberedPages.activePage ?? "None"})
        </$Link>
        <$Link
          onClick={() => routes.brisbaneMap.push({})}
          className={cx({ active: routes.brisbaneMap.isActive })}
        >
          Brisbane Map
        </$Link>
      </$NavBar>
    </>
  );
});

const $Link = styled.a`
  ${tw`
     border-2
     border-gray-400 rounded px-3 py-1 font-mono font-bold
     transition-all
     cursor-pointer
     text-center
  `}

  &:hover {
    ${tw`border-blue-800`}
  }
`;

// const $NavBar = styled.main`
//   ${tw`fixed flex top-0 left-0 p-4 py-6 z-10 pt-2 w-full justify-center items-stretch`}
//   box-shadow: 0 3px 7px #0008;
// `;

const $NavBar = styled.main`
  ${tw`
    fixed flex
    top-0 left-0
    px-1 py-4
    z-10 
    w-full
    justify-center items-center
    bg-gray-100
  `}
  box-shadow: 0 3px 7px #0008;

  > a {
    ${tw`mx-5`}
  }
`;
// This doesnt work with emotioncss @ twin.macro...
// > ${$Link} {
