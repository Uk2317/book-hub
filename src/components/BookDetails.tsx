import { Component } from "react";
import Cookies from "js-cookie";
import { BsFillStarFill } from "react-icons/bs";
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

interface BookDetail {
  id: string;
  authorName: string;
  coverPic: string;
  aboutBook: string;
  rating: number;
  readStatus: string;
  title: string;
  aboutAuthor: string;
}

interface Props {
  navigate: (path: string) => void;
  params: { id: string };
}

interface State {
  apiStatus: ApiStatus;
  book: BookDetail | null;
}

const FALLBACK_COVER =
  "https://assets.ccbp.in/frontend/react-js/one-life-one-chance-book.png";

class BookDetails extends Component<Props, State> {
  private _isMounted = false;

  state: State = { apiStatus: apiStatusConstants.initial, book: null };

  componentDidMount() {
    this._isMounted = true;
    document.title = "Book Hub — Book Details";
    this.getBookDetails();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  getBookDetails = async () => {
    if (this._isMounted) {
      this.setState({ apiStatus: apiStatusConstants.loading });
    }
    const { id } = this.props.params;
    const token = Cookies.get("jwt_token");
    if (!token) {
      this.props.navigate("/login");
      return;
    }

    const url = `https://apis.ccbp.in/book-hub/books/${id}`;
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
        const b = data.book_details;
        if (this._isMounted) {
          document.title = `Book Hub — ${b.title}`;
          this.setState({
            book: {
              id: b.id,
              authorName: b.author_name,
              coverPic: b.cover_pic,
              aboutBook: b.about_book,
              rating: b.rating,
              readStatus: b.read_status,
              title: b.title,
              aboutAuthor: b.about_author,
            },
            apiStatus: apiStatusConstants.success,
          });
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

  handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = FALLBACK_COVER;
  };

  renderDetails() {
    const { book } = this.state;
    if (!book) return null;
    return (
      <div className="details-card">
        <div className="details-top">
          <img
            src={book.coverPic}
            alt={book.title}
            className="details-cover"
            onError={this.handleImageError}
          />
          <div className="details-info">
            <h1 className="details-title">{book.title}</h1>
            <p className="details-author">{book.authorName}</p>
            <p className="details-meta">
              <span className="book-card-rating-label">Avg Rating </span>
              <BsFillStarFill className="details-star" />
              {book.rating}
            </p>
            <p className="details-meta">
              <span className="book-card-rating-label">Status: </span>
              <span className="details-status-value">{book.readStatus}</span>
            </p>
          </div>
        </div>

        <hr className="details-divider" />

        <div>
          <h2 className="details-subtitle">About Author</h2>
          <p className="details-body-text">{book.aboutAuthor}</p>
        </div>

        <div className="details-about-book">
          <h2 className="details-subtitle">About Book</h2>
          <p className="details-body-text">{book.aboutBook}</p>
        </div>
      </div>
    );
  }

  renderContent() {
    const { apiStatus } = this.state;
    switch (apiStatus) {
      case apiStatusConstants.loading:
        return <Loader />;
      case apiStatusConstants.success:
        return this.renderDetails();
      case apiStatusConstants.failure:
        return <FailureView onRetry={this.getBookDetails} />;
      default:
        return null;
    }
  }

  render() {
    return (
      <div className="details-page">
        <Header />
        <main className="details-main animate-fade-in">{this.renderContent()}</main>
        <Footer />
      </div>
    );
  }
}

export default withRouter(BookDetails);
