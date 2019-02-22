import React from 'react';
import Ratings from './Ratings.jsx';
import Search from './Search.jsx';
import Sort from './Sort.jsx';
import Reviews from './Reviews.jsx';

class App extends React.Component {
  constructor(props) {
    super(props);
    
    var id = 1;

    var path = window.location.pathname.split('/');
    var pathId = Number.parseInt(path[1], 10);
    if (!Number.isNaN(pathId)) {
      id = pathId;
    }

    this.state = {
      listingId: id,
      rating: 0,
      accuracy: 0,
      communication: 0,
      cleanliness: 0,
      location: 0, 
      checkin: 0,
      value: 0,
      reviews: [],
      allReviews: [],
      numOfReviews: 0,
      sort: 'relevant',
      searchValue: '',
      reviewPage: 1,
      commentPerPage: 7
    }
    this.handleSort = this.handleSort.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.backToReviews = this.backToReviews.bind(this);
    this.changePage = this.changePage.bind(this);
    this.nextPage = this.nextPage.bind(this);
    this.previousPage = this.previousPage.bind(this);
  }

  componentDidMount() {
    fetch(`http://ec2-18-216-223-244.us-east-2.compute.amazonaws.com/api/reviews/${this.state.listingId}`)
    .then((res) => res.json())
    .then((jsonRes) => this.setState({
      rating: Math.round(jsonRes[0].rating * 2),
      accuracy: Math.round(jsonRes[0].accuracy * 2),
      communication: Math.round(jsonRes[0].communication * 2),
      cleanliness: Math.round(jsonRes[0].cleanliness * 2),
      location: Math.round(jsonRes[0].location * 2), 
      checkin: Math.round(jsonRes[0].checkin * 2),
      value: Math.round(jsonRes[0].value * 2),
      reviews: jsonRes[0].reviews,
      allReviews: jsonRes[0].reviews
    }, () => {
      this.setState({numOfReviews: this.state.reviews.length});
    }))
  }

  handleSort(event) {
    this.setState({sort: event.target.value}, () => {
      if (this.state.sort === 'relevant') {
        var relevantReviews = [];
        for (var i = 1; i <= this.state.reviews.length; i++) {
          for (var j = 0; j < this.state.reviews.length; j++) {
            if (this.state.reviews[j].reviewId === i) {
              relevantReviews.push(this.state.reviews[j]);
            }
          }
        }
        this.setState({reviews: relevantReviews, reviewPage: 1});
      } else if (this.state.sort === 'recent') {
        var months = {January: 1, February: 2, March: 3, April: 4, May: 5, June: 6, July: 7, August: 8, September: 9, October: 10, November: 11, December: 12};

        for (var i = 0; i <= this.state.reviews.length; i++) {
          for (var j = i; j < this.state.reviews.length; j++) {
            var currentReview = this.state.reviews[i];
            var nextReview = this.state.reviews[j];
            if (nextReview.year > currentReview.year) {
              this.state.reviews[i] = nextReview;
              this.state.reviews[j] = currentReview;
            } else if (nextReview.year === currentReview.year) {
              if (months[nextReview.month] > months[currentReview.month]) {
                this.state.reviews[i] = nextReview;
                this.state.reviews[j] = currentReview;
              }
            }
          }
        }
        this.setState({reviews: this.state.reviews, reviewPage: 1});
      }
    })
  }

  handleSearch(event) {
    this.setState({searchValue: event.target.value}, () => {
      var reviewsToRender = [];
      for (var i = 0; i < this.state.allReviews.length; i++) {
        if (this.state.allReviews[i].review.includes(this.state.searchValue)) {
          reviewsToRender.push(this.state.allReviews[i]);
        }
      }
      this.setState({reviews: reviewsToRender, reviewPage: 1});
    });
  }

  backToReviews() {
    this.setState({
      reviews: this.state.allReviews,
      searchValue: ''
    });
  }

  changePage(event) {
    this.setState({reviewPage: Number(event.target.innerHTML)});
  }
  
  nextPage() {
    this.setState({reviewPage: this.state.reviewPage + 1});
  }

  previousPage() {
    this.setState({reviewPage: this.state.reviewPage - 1});
  }

  render() {
    return (
    <div className="rev-container">
      <hr className="rev-above-ratings"/>
      <Ratings numOfReviews={this.state.numOfReviews} rating={this.state.rating} accuracy={this.state.accuracy} communication={this.state.communication} cleanliness={this.state.cleanliness} location={this.state.location} checkin={this.state.checkin} value={this.state.value}/>
      <div>
        <div>
          <Search handleSearch={this.handleSearch} value={this.state.searchValue}/>
        </div>
        <div>
          <Sort sort={this.state.sort} handleSort={this.handleSort}/>
        </div>
      </div>
      <hr className="rev-above-reviews"/>
      <Reviews reviews={this.state.reviews} sort={this.state.sort} value={this.state.searchValue} backToReviews={this.backToReviews} allReviews={this.state.allReviews} reviewPage={this.state.reviewPage} commentPerPage={this.state.commentPerPage} changePage={this.changePage} nextPage={this.nextPage} previousPage={this.previousPage}/>
    </div>);
  }
}

export default App;