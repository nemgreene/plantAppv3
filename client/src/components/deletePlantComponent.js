import React from "react";
//delete plant button
class DeletePlantComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: null,
    };

    this.deleteFromDB = this.deleteFromDB.bind(this);
  }

  deleteFromDB() {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    var urlencoded = new URLSearchParams();
    urlencoded.append("id", `${this.props.id}`);

    var requestOptions = {
      method: "DELETE",
      headers: myHeaders,
      body: urlencoded,
      redirect: "follow",
    };

    fetch(`/user/plants/delete`, requestOptions)
      .then((response) => response.text())
      .catch((error) => console.log("error", error));
  }

  render() {
    return (
      <div>
        <button
          className="btn btn-outline-danger"
          style={({ width: 100 }, { textAlign: "center" })}
          onClick={this.deleteFromDB}
        >
          Delete
        </button>
      </div>
    );
  }
}

export default DeletePlantComponent;
