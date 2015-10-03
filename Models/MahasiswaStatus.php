<?php
namespace Models;

use Dhtmlx\Connector;
use Resources;

class MahasiswaStatus extends Resources\Validation
{
    protected $data = [];
    protected $checkEventName = true;

    public function __construct()
    {
        parent::__construct();
        $this->db = new Resources\Database('pddikti');
        $this->conn = new Connector\JSONDataConnector($this->db, "MySQLi");
        $this->session = new Resources\Session;
    }

    public function init()
    {
        $this->conn->useModel($this);
        $this->conn->dynamic_loading(30);
        $this->conn->render_table("list_mahasiswa_status_view", "id_reg_pd", $this->setFields());
    }

    public function setRules()
    {
        return [
            'event_name' => [
                'rules' => ['required', 'min' => 3, 'callback' => 'eventNameIsExist'],
                'label' => 'Nama Event',
                'filter' => ['trim', 'strtolower', 'ucwords'],
            ],
        ];
    }

    protected function get_values($action)
    {
        $this->data['event_name'] = $action->get_value("event_name");
        $this->data['start_date'] = $action->get_value("start_date");
        $this->data['end_date'] = $action->get_value("end_date");
    }

    protected function setFields()
    {
        $fields = [
            "id_reg_pd",
            "nipd",
            "nm_pd",
            "nm_lemb",
            "mulai_smt",
            "ket_keluar",
            "tgl_keluar",
            "ket",
        ];
        return implode(",", $fields);
    }

    protected function validation($action)
    {

        if (!$this->validate($this->data)) {
            $action->invalid();
            $action->set_response_attribute("details", $this->messages());
            return false;
        }
        return true;
    }

    protected function messages()
    {
        $msg = $this->errorMessages();
        $text = "";

        if ($msg) {
            foreach ($msg as $key => $value) {
                $text .= $key . " : " . $value . ", ";
            }
        }

        $text = rtrim($text, ", ");
        return $text;
    }

    public function insert($action)
    {
        $this->get_values($action);

        if ($this->validation($action)) {
            $this->db->insert("mahasiswa_pt", $this->data);
            $action->success($this->db->insertId());
        }
    }

    public function update($action)
    {
        $this->get_values($action);

        if ($this->validation($action)) {
            $this->db->update("mahasiswa_pt", $this->data, array("id_reg_pd" => $action->get_id()));
            $action->success();
        }
    }

    public function delete($action)
    {
        $this->db->delete("mahasiswa_pt", array("id_reg_pd" => $action->get_id()));
        $action->success();
    }

}