import Truncate from 'react-truncate'
import React from 'react';

class IndReviewText extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      truncate: true
    }

    this.showFullReview = this.showFullReview.bind(this);
  }

  showFullReview() {
    this.setState({truncate: false});
  }

  render() {
    var truncate = (
      <div className="rev-review">
        <Truncate lines={4} ellipsis={<span className="rev-readMore" onClick={this.showFullReview}>... <u>Read more</u></span>}>
          {this.props.reviewText}
        </Truncate>
      </div>
    );

    var fullText = (
      <div className="rev-review">
        {this.props.reviewText}
      </div>
    );
    
    if (this.state.truncate) {
      return truncate;
    } else {
      return fullText;
    }
  }
}


export default IndReviewText;