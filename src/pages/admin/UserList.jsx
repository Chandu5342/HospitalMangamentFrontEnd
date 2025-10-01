import React, { useEffect, useState } from 'react';
import { listUsers, deleteUser, updateUser } from '../../api/adminApi.js';
import { Container, Card, Table, Button, Form, Modal } from 'react-bootstrap';

const UserList = ({ token, refreshFlag }) => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(10);

  const [editUser, setEditUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const fetchUsers = async (pageNumber = 1) => {
    try {
      const data = await listUsers(token, pageNumber, limit, search, roleFilter);
      setUsers(data.data);
      setPage(data.currentPage);
      setTotalPages(data.totalPages);
    } catch {
      alert('Failed to fetch users');
    }
  };

  useEffect(() => { fetchUsers(page); }, [search, roleFilter, limit, refreshFlag]); // <-- added refreshFlag

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try { await deleteUser(token, id); fetchUsers(page); } catch { alert('Failed to delete'); }
  };

  const handleEditClick = (user) => { setEditUser(user); setShowEditModal(true); };
  const handleEditSave = async () => {
    try { await updateUser(token, editUser.id, editUser); setShowEditModal(false); fetchUsers(page); }
    catch { alert('Failed to update'); }
  };

  return (
    <Container className="mt-4">
      <Card className="p-3 shadow">
        <h3 className="mb-3 text-primary">Users List</h3>

        <Form className="d-flex mb-3">
          <Form.Control placeholder="Search by name or email" value={search} onChange={e => setSearch(e.target.value)} className="me-2" />
          <Form.Select className="me-2" value={roleFilter} onChange={e => setRoleFilter(e.target.value)}>
            <option value="">All Roles</option>
            <option value="doctor">Doctor</option>
            <option value="reception">Receptionist</option>
            <option value="lab">Lab Staff</option>
            <option value="admin">Admin</option>
          </Form.Select>
          <Button onClick={() => fetchUsers(1)}>Search / Filter</Button>
        </Form>

        <Form.Select className="w-auto mb-3" value={limit} onChange={e => setLimit(parseInt(e.target.value))}>
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </Form.Select>

        <Table striped bordered hover responsive>
          <thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Role</th><th>Created At</th><th>Action</th></tr></thead>
          <tbody>{users.map(u => <tr key={u.id}>
            <td>{u.id}</td><td>{u.name}</td><td>{u.email}</td><td>{u.role}</td><td>{new Date(u.created_at).toLocaleString()}</td>
            <td>
              <Button size="sm" variant="warning" onClick={() => handleEditClick(u)}>Edit</Button>{' '}
              <Button size="sm" variant="danger" onClick={() => handleDelete(u.id)}>Delete</Button>
            </td>
          </tr>)}</tbody>
        </Table>

        {totalPages > 1 && <div className="d-flex justify-content-between">
          <Button disabled={page === 1} onClick={() => fetchUsers(page - 1)}>Previous</Button>
          <span>Page {page} of {totalPages}</span>
          <Button disabled={page === totalPages} onClick={() => fetchUsers(page + 1)}>Next</Button>
        </div>}

        <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
          <Modal.Header closeButton><Modal.Title>Edit User</Modal.Title></Modal.Header>
          <Modal.Body>
            {editUser && <Form>
              <Form.Group className="mb-2"><Form.Label>Name</Form.Label>
                <Form.Control value={editUser.name} onChange={e => setEditUser({ ...editUser, name: e.target.value })} />
              </Form.Group>
              <Form.Group className="mb-2"><Form.Label>Email</Form.Label>
                <Form.Control value={editUser.email} onChange={e => setEditUser({ ...editUser, email: e.target.value })} />
              </Form.Group>
              <Form.Group className="mb-2"><Form.Label>Role</Form.Label>
                <Form.Select value={editUser.role} onChange={e => setEditUser({ ...editUser, role: e.target.value })}>
                  <option value="doctor">Doctor</option>
                  <option value="reception">Receptionist</option>
                  <option value="lab">Lab Staff</option>
                  <option value="admin">Admin</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-2"><Form.Label>Password (leave blank to keep)</Form.Label>
                <Form.Control type="password" value={editUser.password || ''} onChange={e => setEditUser({ ...editUser, password: e.target.value })} />
              </Form.Group>
            </Form>}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleEditSave}>Save Changes</Button>
          </Modal.Footer>
        </Modal>
      </Card>
    </Container>
  );
};

export default UserList;
