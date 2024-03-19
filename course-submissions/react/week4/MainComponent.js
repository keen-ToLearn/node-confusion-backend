import React, {Component} from 'react';
import Home from './HomeComponent';
import Contact from './ContactComponent';
import About from './AboutComponent';
import Header from './HeaderComponent';
import Menu from './MenuComponent';
import DishDetail from './DishdetailComponent';
import Footer from './FooterComponent';
import {Switch, Route, Redirect, withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import {postComment, fetchComments, fetchDishes, fetchPromos, fetchLeaders, postFeedback} from '../redux/ActionCreators';
import {actions} from 'react-redux-form';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

const mapStateToProps = state => {
    return {
        dishes : state.dishes,
        comments : state.comments,
        leaders : state.leaders,
        promotions : state.promotions
    }
}

const mapDispatchToProps = dispatch => ({
    postComment: (dishId, rating, author, comment) => dispatch(postComment(dishId, rating, author, comment)),
    fetchDishes: () => { dispatch(fetchDishes()) },
    resetFeedbackForm: () => dispatch(actions.reset('feedback')),
    fetchComments: () => { dispatch(fetchComments()) },
    fetchPromos: () => { dispatch(fetchPromos()) },
    fetchLeaders: () => { dispatch(fetchLeaders()) },
    postFeedback: (feedback) => dispatch(postFeedback(feedback))
});

class Main extends Component{

    componentDidMount(){
        this.props.fetchDishes();
        this.props.fetchComments();
        this.props.fetchPromos();
        this.props.fetchLeaders();
    }

    render(){
        const HomePage = () => {
            return(
                <>
                    <Home
                        dish={this.props.dishes.dishes.filter((dish) => dish.featured)[0]}
                        dishesLoading={this.props.dishes.isLoading}
                        dishesErrMes={this.props.dishes.errMes}
                        promotion={this.props.promotions.promotions.filter((promo) => promo.featured)[0]}
                        promosLoading={this.props.promotions.isLoading}
                        promosErrMes={this.props.promotions.errMes}
                        leader={this.props.leaders.leaders.filter((leader) => leader.featured)[0]}
                        leadersLoading={this.props.leaders.isLoading}
                        leadersErrMes={this.props.leaders.errMes}
                    />
                </>
            );
        }

        const DishWithId = ({match}) => {
            return(
                <div>
                    <DishDetail selectedDish={this.props.dishes.dishes.filter((dish) => dish.id === parseInt(match.params.dishId,10))[0]}
                    isLoading={this.props.dishes.isLoading}
                    errMes={this.props.dishes.errMes}
                    dishComments={this.props.comments.comments.filter((comment) => comment.dishId === parseInt(match.params.dishId,10))}
                    commentsErrMes={this.props.comments.errMes}
                    postComment={this.props.postComment}
                    />
                </div>
            );
        }
        
        return(
            <div className="App">
                <Header/>
                <TransitionGroup>
                    <CSSTransition key={this.props.location.key} classNames="page" timeout={300}>
                        <Switch>
                            <Route path="/home" component={HomePage}/>
                            <Route exact path="/menu" component={() => <Menu dishes={this.props.dishes}/>}/>
                            <Route path="/menu/:dishId" component={DishWithId}/>
                            <Route exact path="/contactus" component={() => <Contact resetFeedbackForm={this.props.resetFeedbackForm} postFeedback={this.props.postFeedback}/>}/>
                            <Route path="/aboutus" component={() => <About leaders={this.props.leaders}/>}/>
                            <Redirect to="/home"/>
                        </Switch>
                    </CSSTransition>
                </TransitionGroup>
                <Footer/>
            </div>
        );
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Main));