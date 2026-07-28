import { Component } from "react";
import Cookies from "js-cookie";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import Loader from "./Loader";
import FailureView from "./FailureView";
import { withRouter } from "../utils/router";

const apiStatusConstants = {
  initial: "INITIAL",
  loading: "LOADING",
  success: "SUCCESS",
  failure: "FAILURE",
} as const;

type ApiStatus = typeof apiStatusConstants[keyof typeof apiStatusConstants];

interface Book {
  id: string;
  authorName: string;
  coverPic: string;
  title: string;
}

interface Props {
  navigate: (path: string) => void;
}

interface State {
  apiStatus: ApiStatus;
  topRatedBooks: Book[];
}

const FALLBACK_COVER =
  "https://assets.ccbp.in/frontend/react-js/one-life-one-chance-book.png";

class Home extends Component<Props, State> {
  private _isMounted = false;

  state: State = { apiStatus: apiStatusConstants.initial, topRatedBooks: [] };

  componentDidMount() {
    this._isMounted = true;
    document.title = "Book Hub — Home";
    this.getTopRatedBooks();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  getTopRatedBooks = async () => {
    if (this._isMounted) {
      this.setState({ apiStatus: apiStatusConstants.loading });
    }
    const token = Cookies.get("jwt_token");
    if (!token) {
      this.props.navigate("/login");
      return;
    }

    const url = "https://apis.ccbp.in/book-hub/top-rated-books";
    const options = {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    };

    try {
      const response = await fetch(url, options);
      if (response.status === 401) {
        Cookies.remove("jwt_token");
        this.props.navigate("/login");
        return;
      }

      if (response.ok) {
        const data = await response.json();
        const books: Book[] = data.books.map((b: any) => ({
          id: b.id,
          authorName: b.author_name,
          coverPic: b.cover_pic,
          title: b.title,
        }));
        if (this._isMounted) {
          this.setState({ topRatedBooks: books, apiStatus: apiStatusConstants.success });
        }
      } else {
        if (this._isMounted) {
          this.setState({ apiStatus: apiStatusConstants.failure });
        }
      }
    } catch {
      if (this._isMounted) {
        this.setState({ apiStatus: apiStatusConstants.failure });
      }
    }
  };

  onFindBooks = () => this.props.navigate("/shelf");

  handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = FALLBACK_COVER;
  };

  renderSlider() {
    const { topRatedBooks } = this.state;
    const settings = {
      dots: false,
      infinite: false,
      speed: 500,
      slidesToShow: 4,
      slidesToScroll: 1,
      responsive: [
        { breakpoint: 1200, settings: { slidesToShow: 4 } },
        { breakpoint: 1024, settings: { slidesToShow: 3 } },
        { breakpoint: 768, settings: { slidesToShow: 2 } },
        { breakpoint: 480, settings: { slidesToShow: 1 } },
      ],
    };

    return (
      <Slider {...settings}>
        {topRatedBooks.map((book) => (
          <Link key={book.id} to={`/books/${book.id}`} className="slider-book-link">
            <div className="slider-book-item">
              <img
                src={book.coverPic}
                alt={book.title}
                className="slider-book-cover"
                onError={this.handleImageError}
              />
              <h3 className="slider-book-title">{book.title}</h3>
              <p className="slider-book-author">{book.authorName}</p>
            </div>
          </Link>
        ))}
      </Slider>
    );
  }

  renderContent() {
    const { apiStatus } = this.state;
    switch (apiStatus) {
      case apiStatusConstants.loading:
        return <Loader />;
      case apiStatusConstants.success:
        return this.renderSlider();
      case apiStatusConstants.failure:
        return <FailureView onRetry={this.getTopRatedBooks} />;
      default:
        return null;
    }
  }

  render() {
    return (
      <div className="page">
        <Header />
        <main className="page-main animate-fade-in">
          <section className="home-hero">
            <h1 className="home-hero-title">Find Your Next Favorite Books?</h1>
            <p className="home-hero-desc">
              You are in the right place. Tell us what titles or genres you have enjoyed in the past,
              and we will give you surprisingly insightful recommendations.
            </p>
            <button type="button" onClick={this.onFindBooks} className="home-hero-btn">
              Find Books
            </button>
          </section>

          <section className="home-slider-card">
            <div className="home-slider-head">
              <h2 className="home-slider-title">Top Rated Books</h2>
              <button
                type="button"
                onClick={this.onFindBooks}
                className="home-slider-find-btn"
              >
                Find Books
              </button>
            </div>
            <div className="home-slider-wrap">{this.renderContent()}</div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }
}

export default withRouter(Home);
