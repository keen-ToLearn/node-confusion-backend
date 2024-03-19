import React, {Component} from 'react';
import { Card, CardImg, CardTitle, CardBody, CardText } from 'reactstrap';
import {Media} from 'reactstrap';

class DishDetail extends Component{
    constructor(props){
        super(props);

        this.state = {
            dishinfo: this.props.selectedDish
        }
    }
    renderDish(info){
        if(info != null){
            return(
                <Card>
                    <CardImg width="100%" src={info.image} alt={info.name}/>
                    <CardBody>
                        <CardTitle>{info.name}</CardTitle>
                        <CardText>{info.description}</CardText>
                    </CardBody>
                </Card>
            );
        }
        else
            return(<div></div>);
    }

    renderComments(info){
        if(info != null){
            const review = info.comments.map((comment) => {
                return(
                    <div key={comment.id}>
                        <Media tag="li">
                            <Media body>
                                <p>{comment.comment}</p>
                                <p>--{comment.author}, {comment.date.slice(0,10)}</p>
                            </Media>
                        </Media>
                    </div>
                );
            });
            return(
                <Media list className="list-unstyled">
                    <h4>Comments</h4>
                    {review}
                </Media>
            );
        }
        else
            return(<div></div>);
    }

    render(){
        console.log(this.state.dishinfo);
        return(
            <div className="row">
                <div className="col-12 col-md-5 m-1">
                    {this.renderDish(this.state.dishinfo)}
                </div>
                <div className="col-md-5 col-12 m-1">
                        {this.renderComments(this.state.dishinfo)}
                </div>
            </div>
        );
    }
}

export default DishDetail;