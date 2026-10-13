import React, { useEffect, useMemo, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import SidebarLinkGroup from "../layout/SidebarLinkGroup";
import { logo, smallLogo } from '../../assets/images/images';
import { getSidebarList } from '../../Reducer/SidebarSlice';

import {
  AiFillSetting,
  AiFillTag,
  AiFillTags,
  BiLineChart,
  BiUserCircle,
  BiUserPin,
  PiClipboardTextBold,
  RxDashboard,
} from "../../assets/icons/index";
import {
  MdClass,
  MdSchool,
  MdAdminPanelSettings,
  MdPayment,
} from 'react-icons/md';
import userRoles from '../../pages/utils/userRoles';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

interface MenuItem {
  id: string | number;
  name: string;
  shortName?: string;
  short_name?: string;
  path?: string;
  url?: string;
  parentId?: number | string | null;
  parent_id?: number | string | null;
  isActive?: boolean;
  is_active?: boolean;
  children?: MenuItem[];
}

const DEFAULT_MENU_ITEMS: MenuItem[] = [
  { id: 1, name: 'Dashboard', shortName: 'dashboard' },
  { id: 2, name: 'Finance', shortName: 'finance' },
  { id: 3, name: 'Booking', shortName: 'booking' },
  { id: 4, name: 'Maintainance', shortName: 'maintainance' },
  { id: 5, name: 'Transport', shortName: 'transport' },
  { id: 6, name: 'Diver', shortName: 'diver' },
];

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const location = useLocation();
  const { pathname } = location;
  const dispatch = useDispatch<any>();

  const { sidebarList } = useSelector((state: any) => state.sidebar || {});

  const trigger = useRef<any>(null);
  const sidebar = useRef<any>(null);

  const storedSidebarExpanded = localStorage.getItem('sidebar-expanded');
  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === 'true'
  );

  const hasFetchedRef = useRef(false);

  // Fetch dynamic sidebar items only once
  useEffect(() => {
    if (hasFetchedRef.current) return;
    if (!sidebarList || sidebarList.length === 0) {
      hasFetchedRef.current = true;
      dispatch(getSidebarList());
    }
  }, [dispatch, sidebarList]);

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  useEffect(() => {
    localStorage.setItem('sidebar-expanded', sidebarExpanded.toString());
    if (sidebarExpanded) {
      document.querySelector('body')?.classList.add('sidebar-expanded');
    } else {
      document.querySelector('body')?.classList.remove('sidebar-expanded');
    }
  }, [sidebarExpanded]);

  const onHoverOpenSidebar = () => {
    setSidebarOpen(false);
  };

  useEffect(() => {
    setSidebarOpen(true);
  }, []);

  const currentUserRole = userRoles();
  console.log("userRole", currentUserRole);

  const getRoutePath = (item: MenuItem): string => {
    if (item.path) return item.path.startsWith('/') ? item.path : `/${item.path}`;
    if (item.url) return item.url.startsWith('/') ? item.url : `/${item.url}`;

    const raw = item.shortName || item.short_name || item.name || '';
    let str = String(raw).trim();
    if (str.startsWith('/')) {
      return str;
    }
    str = str.replace(/[\s_]+/g, '-').toLowerCase();
    return `/${str}`;
  };

  const getSidebarIcon = (item: MenuItem) => {
    const key = `${item?.shortName || item?.short_name || ''} ${item?.name || ''}`.toLowerCase();

    if (key.includes('dash')) {
      return <RxDashboard className='text-xl shrink-0' />;
    }
    if (key.includes('finan') || key.includes('wallet') || key.includes('pay')) {
      return <BiUserPin className='text-xl shrink-0' />;
    }
    if (key.includes('book')) {
      return <BiUserCircle className='text-xl shrink-0' />;
    }
    if (key.includes('maint')) {
      return <BiUserCircle className='text-xl shrink-0' />;
    }
    if (key.includes('trans')) {
      return <BiUserCircle className='text-xl shrink-0' />;
    }
    if (key.includes('div') || key.includes('driv')) {
      return <BiUserCircle className='text-xl shrink-0' />;
    }
    if (key.includes('vehic')) {
      return <BiUserCircle className='text-xl shrink-0' />;
    }
    if (key.includes('sub') && key.includes('cat')) {
      return <BiUserCircle className='text-xl shrink-0' />;
    }
    if (key.includes('cat')) {
      return <BiUserPin className='text-xl shrink-0' />;
    }
    if (key.includes('batch')) {
      return <MdClass className='text-xl shrink-0' />;
    }
    if (key.includes('course')) {
      return <MdSchool className='text-xl shrink-0' />;
    }
    if (key.includes('role')) {
      return <MdAdminPanelSettings className='text-xl shrink-0' />;
    }

    return <BiUserCircle className='text-xl shrink-0' />;
  };

  const isPathActive = (routePath: string): boolean => {
    if (!routePath || routePath === '#' || routePath === '/') {
      return pathname === '/';
    }
    const clean = routePath.replace(/^\//, '');
    if (!clean) return false;
    return pathname === `/${clean}` || pathname.startsWith(`/${clean}/`);
  };

  // Build hierarchical menu tree from flat or nested API response
  const menuTree = useMemo(() => {
    const sourceList: MenuItem[] = (Array.isArray(sidebarList) && sidebarList.length > 0)
      ? sidebarList
      : DEFAULT_MENU_ITEMS;

    const activeItems = sourceList.filter(
      (item) => item.isActive !== false && item.is_active !== false
    );

    const itemMap = new Map<string | number, MenuItem>();
    const roots: MenuItem[] = [];

    activeItems.forEach((item) => {
      itemMap.set(item.id, { ...item, children: [] });
    });

    activeItems.forEach((item) => {
      const parentId = item.parentId ?? item.parent_id ?? 0;
      const current = itemMap.get(item.id);
      if (parentId && parentId !== 0 && parentId !== '0' && itemMap.has(parentId)) {
        itemMap.get(parentId)!.children!.push(current!);
      } else {
        if (current) {
          roots.push(current);
        }
      }
    });

    return roots;
  }, [sidebarList]);

  return (
    <aside
      ref={sidebar}
      style={{ zIndex: 1 }}
      className={`left-0 top-[50px] z-9999 flex w-72 rounded-3xl flex-col overflow-y-hidden overflow-x-hidden bg-white duration-300 ease-linear absolute h-full lg:h-full min-h-[700px] shadow-xl ${
        sidebarOpen
          ? '-translate-x-full lg:static lg:w-24 lg:translate-x-0 '
          : 'lg:translate-x-0 lg:static'
      }`}
      onMouseEnter={onHoverOpenSidebar}
    >
      {/* <!-- SIDEBAR HEADER --> */}
      <div className="flex items-center justify-between gap-2 px-4 py-5 lg:py-[23px]">
        <NavLink className="text-center w-full" to="/">
          {sidebarOpen ? (
            <div className="text-center mb-8">
              <img src={smallLogo} alt="smallLogo" className="inline-block w-6/12" />
            </div>
          ) : (
            <div className="text-center mb-8">
              <img src={logo} alt="logo" className="inline-block w-7/12" />
            </div>
          )}
        </NavLink>
      </div>
      {/* <!-- SIDEBAR HEADER --> */}

      <div className="sidebar_menu no-scrollbar flex flex-col overflow-y-auto overflow-x-hidden w-full duration-300 ease-linear overscroll-none">
        {/* <!-- Sidebar Menu --> */}
        <nav className="mt-0 pb-4 px-4 lg:px-0">
          <div>
            <ul className="mb-6 flex flex-col gap-1.5">
              {menuTree.map((item) => {
                const routePath = getRoutePath(item);
                const hasActiveChild =
                  item.children &&
                  item.children.length > 0 &&
                  item.children.some((child) => isPathActive(getRoutePath(child)));
                const isParentActive = isPathActive(routePath) || !!hasActiveChild;

                if (item.children && item.children.length > 0) {
                  return (
                    <SidebarLinkGroup
                      key={item.id}
                      activeCondition={isParentActive}
                    >
                      {(handleClick, open) => (
                        <React.Fragment>
                          <button
                            type="button"
                            className={`group relative flex items-center justify-between gap-2 rounded-xl px-4 py-2 font-medium text-sm text-gray-700 duration-200 ease-in-out hover:bg-gray-100 mb-1 cursor-pointer border-0 bg-transparent text-left`}
                            onClick={(e) => {
                              e.preventDefault();
                              sidebarOpen ? setSidebarOpen(false) : handleClick();
                            }}
                          >
                            <div className={`flex items-center gap-2 text-gray-700 ${sidebarOpen ? 'justify-center w-full' : ''}`}>
                              {getSidebarIcon(item)}
                              {!sidebarOpen && <span className="text-gray-700 font-medium">{item.name}</span>}
                            </div>
                            {!sidebarOpen && (
                              <svg
                                className={`fill-current text-gray-500 transform transition-transform duration-200 ${
                                  open ? 'rotate-180' : ''
                                }`}
                                width="12"
                                height="8"
                                viewBox="0 0 12 8"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M1.41 0.589996L6 5.17L10.59 0.589996L12 2L6 8L0 2L1.41 0.589996Z"
                                  fill="currentColor"
                                />
                              </svg>
                            )}
                          </button>
                          {!sidebarOpen && (
                            <div className={`translate transform overflow-hidden ${!open && 'hidden'}`}>
                              <ul className="mt-1 mb-2 flex flex-col gap-1 pl-0">
                                {item.children?.map((child) => {
                                  const childPath = getRoutePath(child);
                                  const isChildActive = isPathActive(childPath);
                                  return (
                                    <li key={child.id}>
                                      <NavLink
                                        to={childPath}
                                        className={`group relative flex items-center gap-2 rounded-xl px-3 py-1.5 font-medium text-sm text-gray-700 duration-200 ease-in-out hover:bg-gray-100 hover:text-black mb-1`}
                                      >
                                        <span className="text-gray-600 group-hover:text-black">
                                          {getSidebarIcon(child)}
                                        </span>
                                        <span className="text-gray-700 group-hover:text-black font-medium">{child.name}</span>
                                      </NavLink>
                                    </li>
                                  );
                                })}
                              </ul>
                            </div>
                          )}
                        </React.Fragment>
                      )}
                    </SidebarLinkGroup>
                  );
                }

                return (
                  <li key={item.id}>
                    <NavLink
                      to={routePath}
                      className={`group relative flex items-center gap-2 rounded-sm px-4 py-2 ${
                        sidebarOpen ? 'justify-center' : 'justify-start'
                      } font-normal text-sm text-gray-600 duration-300 ease-in-out hover:bg-graydark mb-2 ${
                        isParentActive && 'bg-graydark dark:bg-meta-4'
                      }`}
                    >
                      {sidebarOpen ? (
                        <>
                          {getSidebarIcon(item)}
                        </>
                      ) : (
                        <>
                          {getSidebarIcon(item)}
                          <span>{item.name}</span>
                        </>
                      )}
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
