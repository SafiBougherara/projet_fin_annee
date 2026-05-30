import { useEffect, useMemo, useState } from 'react';
import restaurantService, { type RestaurantItem } from '../services/restaurant.service';
import reservationService, { type ReservationItem, type CreateReservationPayload } from '../services/reservation.service';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  type SelectChangeEvent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import '../App.css';

const initialForm = {
  clientName: '',
  clientPhone: '',
  clientEmail: '',
  restaurantId: '',
  tableId: '',
  dateReservation: '',
  heureReservation: '',
  nombrePersonnes: '2',
  demandesSpeciales: '',
};

export default function Dashboard() {
  const [restaurants, setRestaurants] = useState<RestaurantItem[]>([]);
  const [reservations, setReservations] = useState<ReservationItem[]>([]);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // States for Edit modal
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    id: 0,
    clientName: '',
    clientPhone: '',
    clientEmail: '',
    restaurantId: '',
    tableId: '',
    dateReservation: '',
    heureReservation: '',
    nombrePersonnes: '2',
    demandesSpeciales: '',
    statut: 'confirmée',
  });

  // States for delete confirmation
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [reservationToDelete, setReservationToDelete] = useState<ReservationItem | null>(null);

  const selectedRestaurant = useMemo(
    () => restaurants.find((restaurant) => restaurant.id === Number(form.restaurantId)),
    [form.restaurantId, restaurants],
  );

  const editSelectedRestaurant = useMemo(
    () => restaurants.find((restaurant) => restaurant.id === Number(editForm.restaurantId)),
    [editForm.restaurantId, restaurants],
  );

  useEffect(() => {
    const loadData = async () => {
      try {
        const [restaurantsData, reservationsData] = await Promise.all([
          restaurantService.getRestaurants(),
          reservationService.getReservations(),
        ]);
        setRestaurants(restaurantsData);
        setReservations(reservationsData);
        if (restaurantsData.length > 0) {
          setForm((prev) => ({
            ...prev,
            restaurantId: prev.restaurantId || String(restaurantsData[0].id),
          }));
        }
      } catch (err) {
        setError('Impossible de charger les données.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const refreshReservations = async () => {
    try {
      const reservationsData = await reservationService.getReservations();
      setReservations(reservationsData);
    } catch {
      setError('Échec de récupération des réservations.');
    }
  };

  const handleChange = (field: keyof typeof form) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleEditChange = (field: keyof typeof editForm) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent) => {
    setEditForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setSaving(true);

    if (!form.clientName || !form.clientPhone || !form.dateReservation || !form.heureReservation || !form.restaurantId) {
      setError('Veuillez remplir tous les champs obligatoires.');
      setSaving(false);
      return;
    }

    const payload: CreateReservationPayload = {
      clientName: form.clientName,
      clientPhone: form.clientPhone,
      clientEmail: form.clientEmail || undefined,
      restaurantId: Number(form.restaurantId),
      tableId: form.tableId ? Number(form.tableId) : undefined,
      dateReservation: form.dateReservation,
      heureReservation: form.heureReservation,
      nombrePersonnes: Number(form.nombrePersonnes),
      demandesSpeciales: form.demandesSpeciales || undefined,
    };

    try {
      await reservationService.createReservation(payload);
      setSuccess('Réservation créée avec succès.');
      setForm((prev) => ({
        ...prev,
        clientName: '',
        clientPhone: '',
        clientEmail: '',
        tableId: '',
        dateReservation: '',
        heureReservation: '',
        nombrePersonnes: '2',
        demandesSpeciales: '',
      }));
      await refreshReservations();
    } catch {
      setError('Erreur lors de la création de la réservation.');
    } finally {
      setSaving(false);
    }
  };

  const handleOpenEdit = (res: ReservationItem) => {
    setEditForm({
      id: res.id,
      clientName: res.client.nom ?? '',
      clientPhone: res.client.telephone ?? '',
      clientEmail: res.client.email ?? '',
      restaurantId: String(res.restaurant.id ?? ''),
      tableId: String(res.table?.id ?? ''),
      dateReservation: res.dateReservation ?? '',
      heureReservation: res.heureReservation ?? '',
      nombrePersonnes: String(res.nombrePersonnes ?? '2'),
      demandesSpeciales: res.demandesSpeciales ?? '',
      statut: res.statut ?? 'confirmée',
    });
    setEditOpen(true);
  };

  const handleEditSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setSaving(true);

    if (!editForm.clientName || !editForm.clientPhone || !editForm.dateReservation || !editForm.heureReservation || !editForm.restaurantId) {
      setError('Veuillez remplir tous les champs obligatoires.');
      setSaving(false);
      return;
    }

    try {
      await reservationService.updateReservation(editForm.id, {
        clientName: editForm.clientName,
        clientPhone: editForm.clientPhone,
        clientEmail: editForm.clientEmail || undefined,
        restaurantId: Number(editForm.restaurantId),
        tableId: editForm.tableId ? Number(editForm.tableId) : null,
        dateReservation: editForm.dateReservation,
        heureReservation: editForm.heureReservation,
        nombrePersonnes: Number(editForm.nombrePersonnes),
        demandesSpeciales: editForm.demandesSpeciales || undefined,
        statut: editForm.statut,
      });
      setSuccess('Réservation mise à jour avec succès.');
      setEditOpen(false);
      await refreshReservations();
    } catch {
      setError('Erreur lors de la modification de la réservation.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteClick = (res: ReservationItem) => {
    setReservationToDelete(res);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!reservationToDelete) return;
    setError(null);
    setSuccess(null);
    try {
      await reservationService.deleteReservation(reservationToDelete.id);
      setSuccess('Réservation supprimée avec succès.');
      setDeleteConfirmOpen(false);
      setReservationToDelete(null);
      await refreshReservations();
    } catch {
      setError('Erreur lors de la suppression de la réservation.');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ px: 3, maxWidth: 1400, mx: 'auto' }}>
      <Box mb={4}>
        <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
          Tableau de Bord des Réservations
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Gère en temps réel les réservations, affecte les tables et change les statuts de tes clients.
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Formulaire de création */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <Card sx={{ boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ borderBottom: '1px solid #eee', pb: 1 }}>
                Nouvelle réservation
              </Typography>
              <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                <TextField
                  label="Nom du client"
                  value={form.clientName}
                  onChange={handleChange('clientName')}
                  fullWidth
                  required
                  margin="dense"
                  size="small"
                />
                <TextField
                  label="Téléphone"
                  value={form.clientPhone}
                  onChange={handleChange('clientPhone')}
                  fullWidth
                  required
                  margin="dense"
                  size="small"
                />
                <TextField
                  label="Email"
                  value={form.clientEmail}
                  onChange={handleChange('clientEmail')}
                  fullWidth
                  margin="dense"
                  size="small"
                />
                <FormControl fullWidth margin="dense" size="small">
                  <InputLabel id="restaurant-label">Restaurant</InputLabel>
                  <Select
                    labelId="restaurant-label"
                    value={form.restaurantId}
                    label="Restaurant"
                    onChange={handleChange('restaurantId')}
                    required
                  >
                    {restaurants.map((restaurant) => (
                      <MenuItem key={restaurant.id} value={String(restaurant.id)}>
                        {restaurant.nom}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth margin="dense" size="small">
                  <InputLabel id="table-label">Table (optionnelle)</InputLabel>
                  <Select
                    labelId="table-label"
                    value={form.tableId}
                    label="Table (optionnelle)"
                    onChange={handleChange('tableId')}
                  >
                    <MenuItem value="">Aucune</MenuItem>
                    {selectedRestaurant?.tables.map((table) => (
                      <MenuItem key={table.id} value={String(table.id)}>
                        {`Table ${table.numeroTable} - ${table.capacite} pers.`}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  label="Date"
                  type="date"
                  value={form.dateReservation}
                  onChange={handleChange('dateReservation')}
                  fullWidth
                  required
                  margin="dense"
                  size="small"
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  label="Heure"
                  type="time"
                  value={form.heureReservation}
                  onChange={handleChange('heureReservation')}
                  fullWidth
                  required
                  margin="dense"
                  size="small"
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  label="Nombre de personnes"
                  type="number"
                  value={form.nombrePersonnes}
                  onChange={handleChange('nombrePersonnes')}
                  fullWidth
                  required
                  margin="dense"
                  size="small"
                  inputProps={{ min: 1 }}
                />
                <TextField
                  label="Demande spéciale"
                  value={form.demandesSpeciales}
                  onChange={handleChange('demandesSpeciales')}
                  fullWidth
                  margin="dense"
                  size="small"
                  multiline
                  rows={2}
                />
                <Button type="submit" variant="contained" color="primary" fullWidth disabled={saving} sx={{ mt: 2, fontWeight: 'bold' }}>
                  {saving ? 'Enregistrement...' : 'Créer la réservation'}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Tableau des réservations */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <Card sx={{ boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ borderBottom: '1px solid #eee', pb: 1 }}>
                Liste des Réservations ({reservations.length})
              </Typography>
              <TableContainer component={Paper} sx={{ mt: 2, maxHeight: '60vh', overflowY: 'auto' }}>
                <Table stickyHeader size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Heure</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Client</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Restaurant</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Table</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Personnes</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Statut</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {reservations.map((reservation) => (
                      <TableRow key={reservation.id} hover>
                        <TableCell>{reservation.dateReservation}</TableCell>
                        <TableCell>{reservation.heureReservation}</TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight="medium">
                            {reservation.client.nom ?? 'Sans nom'}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {reservation.client.telephone}
                          </Typography>
                        </TableCell>
                        <TableCell>{reservation.restaurant.nom}</TableCell>
                        <TableCell>
                          {reservation.table ? (
                            <Box sx={{ bgcolor: '#e3f2fd', color: '#1e88e5', px: 1, py: 0.5, borderRadius: 1, display: 'inline-block', fontWeight: 'bold' }}>
                              T. {reservation.table.numeroTable}
                            </Box>
                          ) : (
                            <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                              Non assignée
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>{reservation.nombrePersonnes}</TableCell>
                        <TableCell>
                          <Box
                            sx={{
                              display: 'inline-block',
                              px: 1,
                              py: 0.25,
                              borderRadius: 1,
                              fontSize: '0.75rem',
                              fontWeight: 'bold',
                              textTransform: 'capitalize',
                              bgcolor:
                                reservation.statut === 'confirmée' ? '#e8f5e9' :
                                reservation.statut === 'terminée' ? '#eceff1' : '#ffebee',
                              color:
                                reservation.statut === 'confirmée' ? '#2e7d32' :
                                reservation.statut === 'terminée' ? '#37474f' : '#c62828',
                            }}
                          >
                            {reservation.statut}
                          </Box>
                        </TableCell>
                        <TableCell align="right">
                          <Box display="flex" justifyContent="flex-end" gap={0.5}>
                            <IconButton size="small" color="primary" onClick={() => handleOpenEdit(reservation)}>
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton size="small" color="error" onClick={() => handleDeleteClick(reservation)}>
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                    {reservations.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={8} align="center" sx={{ py: 3, color: 'text.secondary' }}>
                          Aucune réservation enregistrée.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Modal Edition */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 'bold' }}>Modifier la réservation</DialogTitle>
        <Box component="form" onSubmit={handleEditSubmit}>
          <DialogContent dividers>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Nom du client"
                  value={editForm.clientName}
                  onChange={handleEditChange('clientName')}
                  fullWidth
                  required
                  size="small"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Téléphone"
                  value={editForm.clientPhone}
                  onChange={handleEditChange('clientPhone')}
                  fullWidth
                  required
                  size="small"
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  label="Email"
                  value={editForm.clientEmail}
                  onChange={handleEditChange('clientEmail')}
                  fullWidth
                  size="small"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth size="small">
                  <InputLabel id="edit-restaurant-label">Restaurant</InputLabel>
                  <Select
                    labelId="edit-restaurant-label"
                    value={editForm.restaurantId}
                    label="Restaurant"
                    onChange={handleEditChange('restaurantId')}
                    required
                  >
                    {restaurants.map((restaurant) => (
                      <MenuItem key={restaurant.id} value={String(restaurant.id)}>
                        {restaurant.nom}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth size="small">
                  <InputLabel id="edit-table-label">Table (optionnelle)</InputLabel>
                  <Select
                    labelId="edit-table-label"
                    value={editForm.tableId}
                    label="Table (optionnelle)"
                    onChange={handleEditChange('tableId')}
                  >
                    <MenuItem value="">Aucune</MenuItem>
                    {editSelectedRestaurant?.tables.map((table) => (
                      <MenuItem key={table.id} value={String(table.id)}>
                        {`Table ${table.numeroTable} - ${table.capacite} pers.`}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Date"
                  type="date"
                  value={editForm.dateReservation}
                  onChange={handleEditChange('dateReservation')}
                  fullWidth
                  required
                  size="small"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Heure"
                  type="time"
                  value={editForm.heureReservation}
                  onChange={handleEditChange('heureReservation')}
                  fullWidth
                  required
                  size="small"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Nombre de personnes"
                  type="number"
                  value={editForm.nombrePersonnes}
                  onChange={handleEditChange('nombrePersonnes')}
                  fullWidth
                  required
                  size="small"
                  inputProps={{ min: 1 }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth size="small">
                  <InputLabel id="edit-statut-label">Statut</InputLabel>
                  <Select
                    labelId="edit-statut-label"
                    value={editForm.statut}
                    label="Statut"
                    onChange={handleEditChange('statut')}
                    required
                  >
                    <MenuItem value="confirmée">Confirmée</MenuItem>
                    <MenuItem value="annulée">Annulée</MenuItem>
                    <MenuItem value="terminée">Terminée</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  label="Demande spéciale"
                  value={editForm.demandesSpeciales}
                  onChange={handleEditChange('demandesSpeciales')}
                  fullWidth
                  size="small"
                  multiline
                  rows={3}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setEditOpen(false)} variant="outlined">
              Annuler
            </Button>
            <Button type="submit" variant="contained" color="primary" disabled={saving}>
              {saving ? 'Enregistrement...' : 'Sauvegarder'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* Modal Deletion Confirm */}
      <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
        <DialogTitle sx={{ fontWeight: 'bold' }}>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Es-tu sûr de vouloir supprimer la réservation de{' '}
            <strong>{reservationToDelete?.client.nom ?? 'ce client'}</strong> le{' '}
            <strong>{reservationToDelete?.dateReservation}</strong> à{' '}
            <strong>{reservationToDelete?.heureReservation}</strong> ? Cette action est irréversible.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDeleteConfirmOpen(false)} variant="outlined">
            Annuler
          </Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
