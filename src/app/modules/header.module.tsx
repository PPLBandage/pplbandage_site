"use client";

import { authApi } from "../api.module";
import { useEffect, useRef, useState } from "react";
import Styles from "../styles/header.module.css";
import { CSSTransition } from 'react-transition-group';
import { deleteCookie } from 'cookies-next';
import { useRouter } from "next/navigation";
import Link from 'next/link';
import Image from 'next/image';
import { useQuery } from "@tanstack/react-query";
import { Cookies, useCookies } from "next-client-cookies";
import useCookie from "./useCookie.module";

export interface Query {
  username: string;
  name: string;
  avatar: string;
  avatar_small: string;
  discordID: number;
  joined_at: Date;
}

const Header = (): JSX.Element => {
    const router = useRouter();
    const cookies = useRef<Cookies>(useCookies());
    const logged = useCookie('sessionId');
    const { data, isLoading, isError } = useQuery({
        queryKey: ["userProfile"],
        retry: 5,
        refetchOnWindowFocus: false,
        queryFn: async () => {
            const res = await authApi.get("/users/me");
            return res.data as Query;

        },
    });

    const [expanded, setExpanded] = useState<boolean>(false);
    const [islogged, setIsLogged] = useState<boolean>(false);

    if (!isLoading && !isError && !islogged && cookies.current.get("sessionId")) {
        setIsLogged(true);
    }

    useEffect(() => {
        setIsLogged(logged != undefined);
    }, [logged]);
    

  return (
    <>
    {expanded && <div className={Styles.expanding_menu_parent} onClick={() => setExpanded(false)}/>}
    <header className={Styles.header}>
        <div className={Styles.header_child}>
            <div style={{display: "flex", alignItems: "center", flexWrap: "nowrap"}}>
                <Link  href="/"><img alt="" style={{width: "3rem"}} src="/static/icons/icon-cropped.svg" /></Link>
                <h1 className={Styles.ppl_name}>Повязки <a style={{color: "white", textDecoration: "none"}} href="https://pepeland.net">Pepeland</a></h1>
            </div>
            {cookies.current.get("sessionId") ? 
            <div style={{display: "flex", alignItems: "center", flexWrap: "nowrap"}}>
                <div className={`${Styles.avatar_container} ${!islogged && Styles.placeholders}`} onClick={() => setExpanded(!expanded)}>
                    {data && <Image className={Styles.avatar}
                            src={data?.avatar_small || ""}
                            alt="avatar"
                            width={80}
                            height={80}
                    />}
                </div>
                <img alt="" src="/static/icons/chevron-down.svg" className={ `${Styles.expand_arrow} ${expanded && Styles.expand_arrow_rotated}` } onClick={() => setExpanded(!expanded)} />
            </div> : 
            
            <img alt="" src="/static/icons/burger-menu.svg" onClick={() => setExpanded(!expanded)} className={Styles.login_button}/>
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
                      <Link className={Styles.menu_element} href="/me"><img alt="" style={{marginLeft: "-2px"}} src="/static/icons/user.svg" />Личный кабинет</Link>
                      <Link className={Styles.menu_element} href="/workshop/create"><img alt="" style={{marginLeft: "-2px"}} src="/static/icons/plus.svg" />Создать</Link>
                    </> : 
                    <Link className={Styles.menu_element} href="/me"><img alt="" src="/static/icons/login.svg" />Войти</Link>
                  }
                    <hr style={{border: "1px #596172 solid", margin: "2px"}}></hr>
                    <Link className={Styles.menu_element} href="/"><img alt="" style={{marginLeft: "-2px"}} src="/static/icons/home.svg" />Главная</Link>
                    <Link className={Styles.menu_element} href="/workshop"><img alt="" style={{marginLeft: "-2px"}} src="/static/icons/stack.svg" />Мастерская</Link>
                  {islogged &&
                    <a className={Styles.menu_element} 
                      onClick={() => {
                        authApi.delete("users/me").then(() => {
                          deleteCookie("sessionId");
                          router.replace('/');
                          setIsLogged(false);
                        });
                        
                    }}
                    ><img alt="" src="/static/icons/logout.svg"/>Выйти</a>
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
