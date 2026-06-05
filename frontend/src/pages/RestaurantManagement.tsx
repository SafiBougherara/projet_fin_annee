import { useEffect, useState } from 'react';
import restaurantService, {
  type RestaurantItem,
  type RestaurantTable,
  type CreateRestaurantPayload,
  type CreateTablePayload,
} from '../services/restaurant.service';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  type SelectChangeEvent,
  TextField,
  Typography,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

const initialRestaurantForm: CreateRestaurantPayload = {
  nom: '',
  adresse: '',
  telephone: '',
  email: '',
  capaciteTotale: 50,
  dureeRepas: 90,
  bufferNettoyage: 15,
};

const initialTableForm = {
  numeroTable: '',
  capacite: 4,
  type: 'Standard',
  statut: 'disponible',
};

export default function RestaurantManagement() {
  const [restaurants, setRestaurants] = useState<RestaurantItem[]>([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState<RestaurantItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Restaurant Dialog States
  const [restaurantOpen, setRestaurantOpen] = useState(false);
  const [restaurantForm, setRestaurantForm] = useState<CreateRestaurantPayload>(initialRestaurantForm);
  const [editingRestaurantId, setEditingRestaurantId] = useState<number | null>(null);

  // Table Dialog States
  const [tableOpen, setTableOpen] = useState(false);
  const [tableForm, setTableForm] = useState(initialTableForm);
  const [editingTableId, setEditingTableId] = useState<number | null>(null);

  // Delete Confirmations
  const [deleteConfirmType, setDeleteConfirmType] = useState<'restaurant' | 'table' | null>(null);
  const [idToDelete, setIdToDelete] = useState<number | null>(null);
  const [nameToDelete, setNameToDelete] = useState<string>('');

  useEffect(() => {
    loadRestaurants();
  }, []);

  const loadRestaurants = async () => {
    setLoading(true);
    try {
      const data = await restaurantService.getRestaurants();
      setRestaurants(data);
      if (data.length > 0) {
        // Maintain selected restaurant if possible
        if (selectedRestaurant) {
          const current = data.find((r) => r.id === selectedRestaurant.id);
          setSelectedRestaurant(current || data[0]);
        } else {
          setSelectedRestaurant(data[0]);
        }
      } else {
        setSelectedRestaurant(null);
      }
    } catch {
      setError('Erreur lors du chargement des restaurants.');
    } finally {
      setLoading(false);
    }
  };

  // RESTAURANTS HANDLERS
  const handleOpenRestaurantCreate = () => {
    setEditingRestaurantId(null);
    setRestaurantForm(initialRestaurantForm);
    setRestaurantOpen(true);
  };

  const handleOpenRestaurantEdit = (restaurant: RestaurantItem) => {
    setEditingRestaurantId(restaurant.id);
    setRestaurantForm({
      nom: restaurant.nom,
      adresse: restaurant.adresse,
      telephone: restaurant.telephone,
      email: restaurant.email,
      capaciteTotale: restaurant.capaciteTotale,
      dureeRepas: restaurant.dureeRepas,
      bufferNettoyage: restaurant.bufferNettoyage,
    });
    setRestaurantOpen(true);
  };

  const handleRestaurantSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setSaving(true);

    try {
      if (editingRestaurantId !== null) {
        await restaurantService.updateRestaurant(editingRestaurantId, restaurantForm);
        setSuccess('Restaurant mis à jour avec succès.');
      } else {
        await restaurantService.createRestaurant(restaurantForm);
        setSuccess('Restaurant créé avec succès.');
      }
      setRestaurantOpen(false);
      await loadRestaurants();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erreur lors de la sauvegarde du restaurant.');
    } finally {
      setSaving(false);
    }
  };

  const handleOpenRestaurantDelete = (restaurant: RestaurantItem) => {
    setDeleteConfirmType('restaurant');
    setIdToDelete(restaurant.id);
    setNameToDelete(restaurant.nom);
  };

  // TABLES HANDLERS
  const handleOpenTableCreate = () => {
    if (!selectedRestaurant) return;
    setEditingTableId(null);
    setTableForm(initialTableForm);
    setTableOpen(true);
  };

  const handleOpenTableEdit = (table: RestaurantTable) => {
    setEditingTableId(table.id);
    setTableForm({
      numeroTable: table.numeroTable,
      capacite: table.capacite,
      type: table.type,
      statut: table.statut,
    });
    setTableOpen(true);
  };

  const handleTableSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedRestaurant) return;
    setError(null);
    setSuccess(null);
    setSaving(true);

    const payload: CreateTablePayload = {
      numeroTable: tableForm.numeroTable,
      capacite: Number(tableForm.capacite),
      type: tableForm.type,
      statut: tableForm.statut,
      restaurantId: selectedRestaurant.id,
    };

    try {
      if (editingTableId !== null) {
        await restaurantService.updateTable(editingTableId, payload);
        setSuccess('Table mise à jour avec succès.');
      } else {
        await restaurantService.createTable(payload);
        setSuccess('Table créée avec succès.');
      }
      setTableOpen(false);
      await loadRestaurants();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erreur lors de la sauvegarde de la table.');
    } finally {
      setSaving(false);
    }
  };

  const handleOpenTableDelete = (table: RestaurantTable) => {
    setDeleteConfirmType('table');
    setIdToDelete(table.id);
    setNameToDelete(`Table ${table.numeroTable}`);
  };

  // COMMON DELETE CONFIRM
  const handleConfirmDelete = async () => {
    if (idToDelete === null || !deleteConfirmType) return;
    setError(null);
    setSuccess(null);
    setSaving(true);

    try {
      if (deleteConfirmType === 'restaurant') {
        await restaurantService.deleteRestaurant(idToDelete);
        setSuccess('Restaurant supprimé avec succès.');
      } else {
        await restaurantService.deleteTable(idToDelete);
        setSuccess('Table supprimée avec succès.');
      }
      setDeleteConfirmType(null);
      setIdToDelete(null);
      await loadRestaurants();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Impossible de réaliser la suppression.');
      setDeleteConfirmType(null);
      setIdToDelete(null);
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: keyof CreateRestaurantPayload) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setRestaurantForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleTableInputChange = (field: keyof typeof initialTableForm) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent) => {
    setTableForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  if (loading && restaurants.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ px: 3, maxWidth: 1400, mx: 'auto' }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h4" component="h1" fontWeight="bold" color="text.primary" gutterBottom>
            Gestion des Restaurants et Tables
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Configure tes restaurants et définis leurs plans de tables pour les réservations.
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenRestaurantCreate}
          sx={{ fontWeight: 'bold' }}
        >
          Ajouter un Restaurant
        </Button>
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
        {/* Liste des restaurants */}
        <Grid size={{ xs: 12, md: 5, lg: 4 }}>
          <Typography variant="h6" fontWeight="bold" color="text.primary" gutterBottom>
            Restaurants ({restaurants.length})
          </Typography>
          <Paper sx={{ boxShadow: 2, maxHeight: '65vh', overflowY: 'auto' }}>
            <List>
              {restaurants.map((restaurant) => (
                <ListItem
                  key={restaurant.id}
                  component="div"
                  onClick={() => setSelectedRestaurant(restaurant)}
                  sx={{
                    cursor: 'pointer',
                    bgcolor: selectedRestaurant?.id === restaurant.id ? 'action.selected' : 'inherit',
                    borderLeft: selectedRestaurant?.id === restaurant.id ? '5px solid' : 'none',
                    borderLeftColor: 'primary.main',
                    '&:hover': { bgcolor: selectedRestaurant?.id === restaurant.id ? 'action.selected' : 'action.hover' },
                    transition: 'all 0.2s',
                  }}
                >
                  <ListItemText
                    primary={<Typography fontWeight="bold">{restaurant.nom}</Typography>}
                    secondary={
                      <>
                        <Typography variant="body2" color="text.secondary">
                          📞 {restaurant.telephone}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          📍 {restaurant.adresse}
                        </Typography>
                      </>
                    }
                  />
                  <Box display="flex" gap={0.5}>
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenRestaurantEdit(restaurant);
                      }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenRestaurantDelete(restaurant);
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </ListItem>
              ))}
              {restaurants.length === 0 && (
                <ListItem>
                  <ListItemText primary="Aucun restaurant enregistré" />
                </ListItem>
              )}
            </List>
          </Paper>
        </Grid>

        {/* Détails et Tables du restaurant sélectionné */}
        <Grid size={{ xs: 12, md: 7, lg: 8 }}>
          {selectedRestaurant ? (
            <Grid container spacing={3}>
              {/* Infos restaurant */}
              <Grid size={{ xs: 12 }}>
                <Card sx={{ boxShadow: 2 }}>
                  <CardContent>
                    <Typography variant="h5" fontWeight="bold" color="primary" gutterBottom>
                      {selectedRestaurant.nom}
                    </Typography>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography variant="body2">
                          <strong>Adresse :</strong> {selectedRestaurant.adresse}
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 0.5 }}>
                          <strong>Téléphone :</strong> {selectedRestaurant.telephone}
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 0.5 }}>
                          <strong>Email :</strong> {selectedRestaurant.email}
                        </Typography>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography variant="body2">
                          <strong>Capacité totale :</strong> {selectedRestaurant.capaciteTotale} personnes max
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 0.5 }}>
                          <strong>Durée d'un repas :</strong> {selectedRestaurant.dureeRepas} minutes
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 0.5 }}>
                          <strong>Marge nettoyage :</strong> {selectedRestaurant.bufferNettoyage} minutes
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>

              {/* Liste des tables */}
              <Grid size={{ xs: 12 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6" fontWeight="bold" color="text.primary">
                    Plan des Tables ({selectedRestaurant.tables.length})
                  </Typography>
                  <Button
                    variant="outlined"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={handleOpenTableCreate}
                    sx={{ fontWeight: 'bold' }}
                  >
                    Ajouter une Table
                  </Button>
                </Box>

                <Grid container spacing={2}>
                  {selectedRestaurant.tables.map((table) => (
                    <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={table.id}>
                      <Card sx={{ boxShadow: 2, border: '1px solid #e0e0e0', position: 'relative' }}>
                        <CardContent sx={{ pb: 1 }}>
                          <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                            <Box>
                              <Typography variant="h6" fontWeight="bold" color="text.primary">
                                Table {table.numeroTable}
                              </Typography>
                              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                Capacité : <strong>{table.capacite} pers.</strong>
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Emplacement : {table.type}
                              </Typography>
                            </Box>
                            <Chip
                              label={table.statut}
                              size="small"
                              sx={{
                                fontWeight: 'bold',
                                textTransform: 'uppercase',
                                bgcolor:
                                  table.statut === 'disponible' ? '#e8f5e9' :
                                  table.statut === 'occupée' ? '#ffebee' : '#fff3e0',
                                color:
                                  table.statut === 'disponible' ? '#2e7d32' :
                                  table.statut === 'occupée' ? '#c62828' : '#e65100',
                              }}
                            />
                          </Box>
                          <Divider sx={{ my: 1.5 }} />
                          <Box display="flex" justifyContent="flex-end" gap={0.5}>
                            <IconButton size="small" color="primary" onClick={() => handleOpenTableEdit(table)}>
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton size="small" color="error" onClick={() => handleOpenTableDelete(table)}>
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                  {selectedRestaurant.tables.length === 0 && (
                    <Grid size={{ xs: 12 }}>
                      <Paper sx={{ p: 3, textAlign: 'center', color: 'text.secondary' }}>
                        Aucune table n'est définie pour ce restaurant.
                      </Paper>
                    </Grid>
                  )}
                </Grid>
              </Grid>
            </Grid>
          ) : (
            <Paper sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>
              Sélectionne ou crée un restaurant pour gérer ses tables.
            </Paper>
          )}
        </Grid>
      </Grid>

      {/* dialog RESTAURANT CREATE / EDIT */}
      <Dialog open={restaurantOpen} onClose={() => setRestaurantOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 'bold' }}>
          {editingRestaurantId !== null ? 'Modifier le restaurant' : 'Ajouter un restaurant'}
        </DialogTitle>
        <Box component="form" onSubmit={handleRestaurantSubmit}>
          <DialogContent dividers>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <TextField
                  label="Nom du restaurant"
                  value={restaurantForm.nom}
                  onChange={handleInputChange('nom')}
                  fullWidth
                  required
                  size="small"
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  label="Adresse"
                  value={restaurantForm.adresse}
                  onChange={handleInputChange('adresse')}
                  fullWidth
                  required
                  size="small"
                  multiline
                  rows={2}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Téléphone"
                  value={restaurantForm.telephone}
                  onChange={handleInputChange('telephone')}
                  fullWidth
                  required
                  size="small"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Email"
                  type="email"
                  value={restaurantForm.email}
                  onChange={handleInputChange('email')}
                  fullWidth
                  required
                  size="small"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField
                  label="Capacité globale"
                  type="number"
                  value={restaurantForm.capaciteTotale}
                  onChange={handleInputChange('capaciteTotale')}
                  fullWidth
                  required
                  size="small"
                  inputProps={{ min: 1 }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField
                  label="Durée repas (min)"
                  type="number"
                  value={restaurantForm.dureeRepas}
                  onChange={handleInputChange('dureeRepas')}
                  fullWidth
                  required
                  size="small"
                  inputProps={{ min: 15 }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField
                  label="Nettoyage (min)"
                  type="number"
                  value={restaurantForm.bufferNettoyage}
                  onChange={handleInputChange('bufferNettoyage')}
                  fullWidth
                  required
                  size="small"
                  inputProps={{ min: 0 }}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setRestaurantOpen(false)} variant="outlined">
              Annuler
            </Button>
            <Button type="submit" variant="contained" color="primary" disabled={saving}>
              {saving ? 'Sauvegarde...' : 'Sauvegarder'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* dialog TABLE CREATE / EDIT */}
      <Dialog open={tableOpen} onClose={() => setTableOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 'bold' }}>
          {editingTableId !== null ? 'Modifier la table' : 'Ajouter une table'}
        </DialogTitle>
        <Box component="form" onSubmit={handleTableSubmit}>
          <DialogContent dividers>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <TextField
                  label="Numéro de table"
                  value={tableForm.numeroTable}
                  onChange={handleTableInputChange('numeroTable')}
                  fullWidth
                  required
                  size="small"
                  placeholder="Ex: 12A, 5..."
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  label="Capacité (personnes)"
                  type="number"
                  value={tableForm.capacite}
                  onChange={handleTableInputChange('capacite')}
                  fullWidth
                  required
                  size="small"
                  inputProps={{ min: 1 }}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <FormControl fullWidth size="small">
                  <InputLabel id="table-type-label">Emplacement / Type</InputLabel>
                  <Select
                    labelId="table-type-label"
                    value={tableForm.type}
                    label="Emplacement / Type"
                    onChange={handleTableInputChange('type')}
                    required
                  >
                    <MenuItem value="Standard">Standard</MenuItem>
                    <MenuItem value="Fenêtre">Fenêtre</MenuItem>
                    <MenuItem value="Terrasse">Terrasse</MenuItem>
                    <MenuItem value="Salon">Salon / Privé</MenuItem>
                    <MenuItem value="Bar">Bar</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <FormControl fullWidth size="small">
                  <InputLabel id="table-statut-label">Statut</InputLabel>
                  <Select
                    labelId="table-statut-label"
                    value={tableForm.statut}
                    label="Statut"
                    onChange={handleTableInputChange('statut')}
                    required
                  >
                    <MenuItem value="disponible">Disponible</MenuItem>
                    <MenuItem value="réservée">Réservée</MenuItem>
                    <MenuItem value="occupée">Occupée</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setTableOpen(false)} variant="outlined">
              Annuler
            </Button>
            <Button type="submit" variant="contained" color="primary" disabled={saving}>
              {saving ? 'Sauvegarde...' : 'Sauvegarder'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* CONFIRM DELETE DIALOG */}
      <Dialog open={deleteConfirmType !== null} onClose={saving ? undefined : () => setDeleteConfirmType(null)}>
        <DialogTitle sx={{ fontWeight: 'bold' }}>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <Typography>
            Es-tu sûr de vouloir supprimer <strong>{nameToDelete}</strong> ? Cette action est définitive.
            {deleteConfirmType === 'restaurant' && (
              <Box component="span" sx={{ color: 'error.main', display: 'block', mt: 1, fontWeight: 'medium' }}>
                Attention : la suppression d'un restaurant entraînera la perte de toutes ses tables associées.
              </Box>
            )}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDeleteConfirmType(null)} variant="outlined" disabled={saving}>
            Annuler
          </Button>
          <Button 
            onClick={handleConfirmDelete} 
            color="error" 
            variant="contained" 
            disabled={saving}
            startIcon={saving ? <CircularProgress size={18} color="inherit" /> : null}
          >
            {saving ? 'Suppression...' : 'Supprimer'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
