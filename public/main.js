//Handlebars complier, this is a frontN template, reloadNotes will render the text below
var notesTemplate = Handlebars.compile(
`{{#each notes}}
<div class="note row">
    <div class="col col-sm-6 input"><textarea name="note" data-id="{{ @index }}">{{ this }}</textarea></div>

    <div class="col col-sm-2 d-flex justify-content-center align-items-center">
        <button class="remove btn btn-xs" data-id="{{ @index }}"><i class="fa fa-trash"
  aria-hidden="false"></i></button>
            </div>
</div>
{{/each}}`
);

//fired off everytime user need to update the note list
const reloadNotes = (notes) => {
  console.log("RELOADING");
  $("#notes").html(notesTemplate({ notes: notes }));
};

//on submit, POST the value of the text area to the server
$("#add").submit((e) => {
  e.preventDefault();
  var val = $("textarea[name=note]").val();
  if (val === "") {
    return;
  }
  $("textarea[name=note]").val("");
  axios
    .post("/", {
      note: val,
    })
    .then((res) => {
      reloadNotes(res.data);
    })
    .catch((err) => {
      window.location.reload();
    });
});

//remove on click, send a DELETE request to the server containing the id as req.param
$(".remove").on("click", (event) => {
  console.log(event)
  let id = $(event.target).attr("data-id");
  console.log(id)
  axios
    .delete(id)
    .then((res) => {
      reloadNotes(res.data);
    })
    .catch((err)=>{
      console.log(err)
    })
});

//when focus out of txtarea, send a PUT req containing the id as req.param
$("#notes").on("blur", "textarea", (event) => {
    //The req.body.note is the new value in the text area
    axios
      .put($(event.currentTarget).data("id"), {
        note: $(event.currentTarget).val(),
      })
      .then((res) => {
        reloadNotes(res.data);
      })
      .catch((e) => {
        alert(e);
      });
  });