import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { type IconProp } from '@fortawesome/fontawesome-svg-core';
import { faMugHot, faToolbox } from '@fortawesome/free-solid-svg-icons';
import React from 'react';

export default function Header() {
  return (
    <header
      id="top"
      className="minsz:px-3 text-s"
    >
      <div className=" bg-slate-600 text-center flex flex-col flex-1 flex-wrap items-stretch minsz:rounded-b-sm minsz:flex-row minsz:text-left">
        <div className="p-2 rounded-b-sm flex-1 bg-slate-700">
          <h1 className="inline">FART</h1>
        </div>
        <nav className="flex justify-center flex-wrap gap-y-2 divide-slate-500 divide-x divide-x-dashed minsz:justify-end">
          <HeaderLink
            link="/dc/tools"
            title="More DC Tools"
          >
            <FontAwesomeIcon icon={faToolbox as IconProp} />
          </HeaderLink>
          <HeaderLink
            link="https://github.com/edenchazard/dc-auto-refresher/"
            title="View source on Github (external link)"
          >
            <FontAwesomeIcon icon={faGithub as IconProp} />
          </HeaderLink>
          <HeaderLink
            link="https://ko-fi.com/dctools"
            title="Buy me a ko-fi (external link)"
          >
            <FontAwesomeIcon icon={faMugHot as IconProp} />
          </HeaderLink>
        </nav>
      </div>
    </header>
  );
}

interface HeaderLinkProps extends React.HTMLProps<HTMLAnchorElement> {
  link: string;
}
function HeaderLink({ link, ...props }: HeaderLinkProps) {
  return (
    <a
      href={link}
      className="p-2 min-w-[3rem] text-center hover:border-slate-600 hover:bg-slate-800"
      {...props}
    >
      {props.children}
    </a>
  );
}
