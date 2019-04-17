import React, { Component } from 'react';

class Subscription extends Component {
  render() {
    return (
      <div>
        <div className="card">
          <div className="card-body">
            <h3 className="card-title">
              <i className="fas fa-shopping-cart inline-icon" />
              <span>Subscription</span>
            </h3>
            <div className="row text-center">
              <div className="col-md-3">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title lead">1 Month</h5>
                    $XXXX
                  </div>
                  <div className="card-body">
                    <button className="btn btn-success">Buy</button>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title lead">3 Months</h5>
                    $XXXX
                  </div>
                  <div className="card-body">
                    <button className="btn btn-success">Buy</button>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title lead">6 Months</h5>
                    $XXXX
                  </div>
                  <div className="card-body">
                    <button className="btn btn-success">Buy</button>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title lead">1 Year</h5>
                    $XXXX
                  </div>
                  <div className="card-body">
                    <button className="btn btn-success">Buy</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Subscription;
