import { Component } from "react";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";
import { BsSearch, BsFillStarFill } from "react-icons/bs";
import Header from "./Header";
import Footer from "./Footer";
import Loader from "./Loader";
import FailureView from "./FailureView";
import { withRouter } from "../utils/router";
import { noBooksUri } from "./Illustrations";

const bookshelvesList = [
  { id: "22526c8e-680e-4419-a041-b05cc239ece4", value: "ALL", label: "All" },
  { id: "37e09397-fab2-46f4-9b9a-66b2324b2e22", value: "READ", label: "Read" },
  { id: "2ab42512-3d05-4fba-8191-5122175b154e", value: "CURRENTLY_READING", label: "Currently Reading" },
  { id: "361d5443-437e-4dd4-a7b4-4b4a5808dcf5", value: "WANT_TO_READ", label: "Want to Read" },
];

const apiStatusConstants = {
  initial: "INITIAL",
  loading: "LOADING",
  success: "SUCCESS",
  failure: "FAILURE",
} as const;

type ApiStatus = typeof apiStatusConstants[keyof typeof apiStatusConstants];

interface Book {
  id: string;
  title: string;
  readStatus: string;
  rating: number;
  authorName: string;
  coverPic: string;
}

interface Props {
  navigate: (path: string) => void;
}

interface State {
  apiStatus: ApiStatus;
  books: Book[];
  activeShelf: string;
  activeShelfLabel: string;
  searchInput: string;
  searchText: string;
}

const FALLBACK_COVER =
  "https://assets.ccbp.in/frontend/react-js/one-life-one-chance-book.png";

class Bookshelves extends Component<Props, State> {
  private _isMounted = false;

  state: State = {
    apiStatus: apiStatusConstants.initial,
    books: [],
    activeShelf: "ALL",
    activeShelfLabel: "All",
    searchInput: "",
    searchText: "",
  };

  componentDidMount() {
    this._isMounted = true;
    document.title = "Book Hub — Bookshelves";
    this.getBooks();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  getBooks = async () => {
    if (this._isMounted) {
      this.setState({ apiStatus: apiStatusConstants.loading });
    }
    const { activeShelf, searchText } = this.state;
    const token = Cookies.get("jwt_token");
    if (!token) {
      this.props.navigate("/login");
      return;
    }

    const url = `https://apis.ccbp.in/book-hub/books?shelf=${encodeURIComponent(
      activeShelf
    )}&search=${encodeURIComponent(searchText)}`;

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
          title: b.title,
          readStatus: b.read_status,
          rating: b.rating,
          authorName: b.author_name,
          coverPic: b.cover_pic,
        }));
        if (this._isMounted) {
          this.setState({ books, apiStatus: apiStatusConstants.success });
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

  onClickShelf = (value: string, label: string) => {
    this.setState({ activeShelf: value, activeShelfLabel: label }, this.getBooks);
  };

  onChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ searchInput: e.target.value });
  };

  onClickSearch = () => {
    const { searchInput } = this.state;
    this.setState({ searchText: searchInput }, this.getBooks);
  };

  onSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") this.onClickSearch();
  };

  handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = FALLBACK_COVER;
  };

  renderNoBooks() {
    const { searchText } = this.state;
    return (
      <div className="no-books">
        <img src={noBooksUri} alt="no books" className="no-books-img" />
        <p className="no-books-text">
          Your search for {searchText} did not find any matches.
        </p>
      </div>
    );
  }

  renderBooksList() {
    const { books } = this.state;
    if (books.length === 0) return this.renderNoBooks();
    return (
      <ul className="books-grid">
        {books.map((book) => (
          <li key={book.id} testid="bookItem">
            <Link to={`/books/${book.id}`} className="book-card">
              <img
                src={book.coverPic}
                alt={book.title}
                className="book-card-cover"
                onError={this.handleImageError}
              />
              <div className="book-card-body">
                <h3 className="book-card-title">{book.title}</h3>
                <p className="book-card-author">{book.authorName}</p>
                <div className="book-card-rating">
                  <span className="book-card-rating-label">Avg Rating</span>
                  <BsFillStarFill className="book-card-star" />
                  <span>{book.rating}</span>
                </div>
                <p className="book-card-status">
                  <span className="book-card-status-label">Status: </span>
                  <span className="book-card-status-value">{book.readStatus}</span>
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    );
  }

  renderContent() {
    const { apiStatus } = this.state;
    switch (apiStatus) {
      case apiStatusConstants.loading:
        return <Loader />;
      case apiStatusConstants.success:
        return this.renderBooksList();
      case apiStatusConstants.failure:
        return <FailureView onRetry={this.getBooks} />;
      default:
        return null;
    }
  }

  renderShelvesSidebar() {
    const { activeShelf } = this.state;
    return (
      <div className="shelves-sidebar">
        <h2 className="shelves-sidebar-title">Bookshelves</h2>
        <ul className="shelves-list">
          {bookshelvesList.map((shelf) => {
            const isActive = shelf.value === activeShelf;
            return (
              <li key={shelf.id}>
                <button
                  type="button"
                  onClick={() => this.onClickShelf(shelf.value, shelf.label)}
                  className={isActive ? "shelf-btn active" : "shelf-btn"}
                >
                  {shelf.label}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }

  renderSearchBar(extraClass = "") {
    const { searchInput } = this.state;
    return (
      <div className={`search-wrap ${extraClass}`}>
        <input
          type="search"
          value={searchInput}
          onChange={this.onChangeSearch}
          onKeyDown={this.onSearchKeyDown}
          placeholder="Search"
          className="search-input"
          aria-label="Search books"
        />
        <button
          type="button"
          onClick={this.onClickSearch}
          className="search-btn"
          testid="searchButton"
          aria-label="search"
        >
          <BsSearch />
        </button>
      </div>
    );
  }

  render() {
    const { activeShelfLabel } = this.state;
    return (
      <div className="page">
        <Header />
        <main className="shelves-main animate-fade-in">
          <div className="shelves-mobile-search">{this.renderSearchBar()}</div>

          <div className="shelves-layout">
            <aside className="shelves-aside">{this.renderShelvesSidebar()}</aside>

            <section className="shelves-section">
              <div className="shelves-desktop-head">
                <h1>{activeShelfLabel} Books</h1>
                {this.renderSearchBar("shelves-desktop-search")}
              </div>
              <h1 className="shelves-mobile-heading">{activeShelfLabel} Books</h1>
              {this.renderContent()}
            </section>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
}

export default withRouter(Bookshelves);
