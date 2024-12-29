import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { type IconProp } from '@fortawesome/fontawesome-svg-core';
import { faEgg, faMugHot, faToolbox } from '@fortawesome/free-solid-svg-icons';
import type React from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';

export default function Header() {
  const { data: session } = useSession();

  return (
    <header
      id="top"
      className="minsz:px-3 text-s"
    >
      <button
        type="button"
        className="bg-slate-700 p-2 rounded-t-sm"
        onClick={() => signIn('dragcave')}
      >
        Login
      </button>
      <div className=" bg-slate-700 flex flex-col items-stretch flex-wrap minsz:rounded-b-sm mid-sz:flex-row mid-sz:items-center">
        <h1 className="py-2 px-3 rounded-b-sm text-center flex-1 mid-sz:text-left">
          FART
        </h1>
        <nav className="flex flex-col items-stretch flex-grow divide-slate-500 menu-big:flex-row menu-big:divide-x menu-big:divide-x-dashed ">
          <HeaderLink
            link="/dc/tools"
            title="More DC Tools"
            text="Tools"
          >
            <FontAwesomeIcon icon={faToolbox as IconProp} />
          </HeaderLink>
          <HeaderLink
            link="https://github.com/edenchazard/dc-auto-refresher/"
            title="View source on Github (external link)"
            text="Github"
          >
            <FontAwesomeIcon icon={faGithub as IconProp} />
          </HeaderLink>
          <HeaderLink
            link="https://ko-fi.com/dctools"
            title="Support the site with a ko-fi (external link)"
            text="Ko-fi"
          >
            <FontAwesomeIcon icon={faMugHot as IconProp} />
          </HeaderLink>
          <HeaderLink
            link="https://dragcave.net"
            title="Dragcave (external link)"
            text="Dragcave"
          >
            <FontAwesomeIcon icon={faEgg as IconProp} />
          </HeaderLink>
        </nav>
      </div>
    </header>
  );
}

interface HeaderLinkProps extends React.HTMLProps<HTMLAnchorElement> {
  link: string;
  text: string;
}
function HeaderLink({ link, text, ...props }: HeaderLinkProps) {
  return (
    <a
      href={link}
      className="flex-1 gap-x-2 p-2 items-center flex flex-row text-center bg-slate-600 hover:border-slate-600 hover:bg-slate-800 menu-big:flex-col"
      {...props}
    >
      {props.children}
      {text}
    </a>
  );
}
