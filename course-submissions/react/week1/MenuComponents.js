import React, { Component } from 'react';
import {Card, CardImg, CardImgOverlay, CardTitle} from 'reactstrap';
import DishDetail from './DishdetailComponent';

class Menu extends Component{
    constructor(props){
        super(props);
        console.log('Menu component constructor invoked');
        this.state = {
            selectedDish: null,
        }
    }

    componentDidMount(){
        console.log('Menu component componentDidMount invoked');
    }

    onDishSelect(dish){
        this.setState({selectedDish: dish});
    }

    renderDish(dish){
        if(dish != null)
            return(
                <DishDetail selectedDish={dish}/>
            );
        else
            return(<div></div>);
    }

    render(){
        const menu = this.props.dishes.map((dish) => {
            return(
                <div key={dish.id} className="col-12 col-md-5 m-1">
                    {/*<comment>Clicking on card should load information about dish</comment>*/}
                    <Card onClick={() => {this.onDishSelect(dish)}}>
                        <CardImg width="100%" src={dish.image} alt={dish.name}/>
                        <CardImgOverlay>
                            <CardTitle>{dish.name}</CardTitle>
                        </CardImgOverlay>
                    </Card>
                </div>
            );
        });
        console.log('Menu component render invoked');
        return(
            <div className="container">
                <div className="row">
                    {menu}
                </div>
                {this.renderDish(this.state.selectedDish)}
            </div>
        );
    }
}
export default Menu;