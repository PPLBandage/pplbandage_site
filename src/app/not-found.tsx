import Footer from './modules/footer.module';
import Header from './modules/header.module';
import NotFoundElement from './nf.module';

export default function NotFound() {
    return (
        <body>
            <Header />
            <NotFoundElement />
            <div style={{position: "absolute", bottom: "1rem", left: "1rem", right: "1rem", boxSizing: "border-box"}}>
                <Footer />
            </div>
        </body>
    );
}