import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { type IconProp } from '@fortawesome/fontawesome-svg-core';
import { faMugHot } from '@fortawesome/free-solid-svg-icons';

export default function Header() {
  return (
    <header
      className="p-2 max:p-3 text-s"
      id="top"
    >
      <div className="flex flex-wrap justify-between">
        <div>
          <span>FART v{import.meta.env.VITE_APP_VERSION}</span>
          <div>&copy; eden chazard</div>
        </div>
        <div className="flex gap-2 justify-end">
          <a
            className="underline"
            href="/dc/tools"
          >
            More Tools
          </a>
          <a
            href="https://github.com/edenchazard/dc-auto-refresher/"
            title="Github"
          >
            <FontAwesomeIcon icon={faGithub as IconProp} />
          </a>
          <a
            href="https://ko-fi.com/dctools"
            title="Buy me a ko-fi"
          >
            <FontAwesomeIcon icon={faMugHot as IconProp} />
          </a>
        </div>
      </div>
    </header>
  );
}
