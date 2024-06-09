import { authApi } from "../api.module";
import { LegacyRef, useEffect, useRef, useState } from "react";
import Styles from "../styles/header.module.css";
import { CSSTransition } from 'react-transition-group';
import { getCookie, deleteCookie } from 'cookies-next';
import { useRouter } from "next/navigation";
import Link from 'next/link';
import Image from 'next/image';

import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { Cookies, useCookies } from "next-client-cookies";

const queryClient = new QueryClient();

interface Query {
  username: string;
  name: string;
  avatar: string;
}

const Header = (): JSX.Element => {
  return (
    <QueryClientProvider client={queryClient}>
      <HeaderElement />
    </QueryClientProvider>
  );
};

const HeaderElement = (): JSX.Element => {
    const router = useRouter();
    const cookies = useRef<Cookies>(useCookies());
    const { data, isLoading, isError } = useQuery({
        queryKey: ["userProfile"],
        retry: 5,
        queryFn: async () => {
            const res = await authApi.get("/oauth/users/me", {withCredentials: true});
            return res.data as Query;

        },
    });

    const [expanded, setExpanded] = useState<boolean>(false);
    const [islogged, setIsLogged] = useState<boolean>(false);

    if (!isLoading && !isError && !islogged && cookies.current.get("sessionId")) {
        setIsLogged(true);
    }
    

  return (
    <>
    {expanded && <div className={Styles.expanding_menu_parent} onClick={() => setExpanded(false)}/>}
    <header className={Styles.header}>
        <div className={Styles.header_child}>
            <div style={{display: "flex", alignItems: "center", flexWrap: "nowrap"}}>
                <Link  href="/"><img style={{width: "3rem"}} src="/static/icons/icon-cropped.svg" /></Link>
                <h1 className={Styles.ppl_name}>Повязки <a style={{color: "white", textDecoration: "none"}} href="https://pepeland.net">Pepeland</a></h1>
            </div>
            {cookies.current.get("sessionId") ? 
            <div style={{display: "flex", alignItems: "center", flexWrap: "nowrap"}}>
                <div className={`${Styles.avatar_container} ${!islogged && Styles.placeholders}`} onClick={() => setExpanded(!expanded)}>
                    <Image className={Styles.avatar}
                            src={data?.avatar}
                            alt="avatar"
                            width={80}
                            height={80}
                    />
                </div>
                <img src="/static/icons/chevron-down.svg" className={ `${Styles.expand_arrow} ${expanded && Styles.expand_arrow_rotated}` } onClick={() => setExpanded(!expanded)} />
            </div> : 
            
            <img src="/static/icons/burger-menu.svg" onClick={() => setExpanded(!expanded)} className={Styles.login_button}/>
            }
        </div>
      <>
      {expanded && <div className={Styles.expanding_menu_parent} onClick={() => setExpanded(false)}/>}
        <>
          <div className={Styles.menu_container}>
            <CSSTransition
                in={expanded}
                timeout={150}
                classNames={{
                    enter: Styles['menu-enter'],
                    enterActive: Styles['menu-enter-active'],
                    exit: Styles['menu-exit'],
                    exitActive: Styles['menu-exit-active'],
                }}
                unmountOnExit>
                <div className={Styles.menu}>
                  {islogged ? 
                    <>
                      <Link  className={Styles.menu_element} href="/user/me"><img style={{marginLeft: "-2px"}} src="/static/icons/user.svg" />Личный кабинет</Link>
                      <Link  className={Styles.menu_element} href="/workshop/create"><img style={{marginLeft: "-2px"}} src="/static/icons/plus.svg" />Создать</Link>
                    </> : 
                    <Link className={Styles.menu_element} href="/user/me"><img src="/static/icons/login.svg" />Войти</Link>
                  }
                    <hr style={{width: "100%", border: "1px #596172 solid", margin: "2px"}}></hr>
                    <Link className={Styles.menu_element} href="/workshop"><img style={{marginLeft: "-2px"}} src="/static/icons/stack.svg" />Мастерская</Link>
                  {islogged &&
                    <a className={Styles.menu_element} 
                      onClick={() => {
                        authApi.delete("users/logout").then(() => {
                          deleteCookie("sessionId");
                          router.replace('/');
                        });
                        
                    }}
                    ><img src="/static/icons/logout.svg"/>Выйти</a>
                  }

                    
                </div>
            </CSSTransition>
            </div>
        </>
    </>
    </header>
    </>
  );
};


export default Header;
