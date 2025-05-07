import { Stack, router } from 'expo-router';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput, RefreshControl, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Ionicons, AntDesign, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { getDoc, doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db, auth } from '../../Firebase/Firebase';
import MiniAlert from './MiniAlert';

interface Address {
  id: string;
  FullName: string;
  Street: string;
  City: string;
  State: string;
  ZIP: string;
  Phone: string;
  isDefault: boolean;
}

interface AddressCardProps {
  address: Address;
  onEdit: (address: Address) => void;
  onDelete: (id: string) => void;
  onSetDefault: (id: string) => void;
}

const AddressCard: React.FC<AddressCardProps> = ({ address, onEdit, onDelete, onSetDefault }) => {
  return (
    <View style={styles.addressCard}>
      <View style={styles.addressContent}>
        <View style={styles.addressHeader}>
          <Text style={styles.addressName}>{address.FullName}</Text>
          {address.isDefault && (
            <View style={styles.defaultBadge}>
              <Text style={styles.defaultText}>Default</Text>
            </View>
          )}
        </View>

        <Text style={styles.addressDetail}>{address.Street}</Text>
        <Text style={styles.addressDetail}>{`${address.City}, ${address.State} ${address.ZIP}`}</Text>
        <Text style={styles.addressDetail}>{address.Phone}</Text>
      </View>

      <View style={styles.addressActions}>
        <TouchableOpacity onPress={() => onEdit(address)} style={styles.actionButton}>
          <Ionicons name="create-outline" size={20} color="#5D4037" />
          <Text style={styles.actionText}>Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => onDelete(address.id)} style={styles.actionButton}>
          <Ionicons name="trash-outline" size={20} color="#FF5252" />
          <Text style={[styles.actionText, { color: '#FF5252' }]}>Delete</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onSetDefault(address.id)}
          style={styles.actionButton}
        >
          <Ionicons
            name={address.isDefault ? "star" : "star-outline"}
            size={20}
            color="#FFB300"
          />
          <Text style={[styles.actionText, { color: '#FFB300' }]}>
            {address.isDefault ? "Remove Default" : "Set as Default"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const EmptyAddresses = () => {
  return (
    <View style={styles.emptyContainer}>
      <Ionicons name="location-outline" size={80} color="#CCCCCC" />
      <Text style={styles.emptyText}>No saved addresses</Text>
      <Text style={styles.emptySubtext}>Add a new address for faster checkout</Text>
    </View>
  );
};

const address = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [newAddressModalVisible, setNewAddressModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [currentAddress, setCurrentAddress] = useState<Address | null>(null);
  const [alertMsg, setAlertMsg] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<'success' | 'error'>('success');
  const [formData, setFormData] = useState<Address>({
    id: '',
    FullName: '',
    Street: '',
    City: '',
    State: '',
    ZIP: '',
    Phone: '',
    isDefault: false,
  });

  useEffect(() => {
    fetchUserAddresses();
  }, []);

  const fetchUserAddresses = async () => {
    try {
      setLoading(true);
      const userId = auth.currentUser?.uid;

      if (!userId) {
        console.log("No user logged in");
        setLoading(false);
        setRefreshing(false);
        return;
      }

      const userDoc = await getDoc(doc(db, "Users", userId));

      if (!userDoc.exists()) {
        console.log("User not found");
        setLoading(false);
        setRefreshing(false);
        return;
      }

      const userData = userDoc.data();
      const userAddresses = userData.Address || [];

      const formattedAddresses = userAddresses.map((address: any, index: number) => ({
        id: address.id || `address-${index}`,
        FullName: address.FullName || '',
        Street: address.Street || '',
        City: address.City || '',
        State: address.State || '',
        ZIP: address.ZIP || '',
        Phone: address.Phone || '',
        isDefault: address.isDefault || false,
      }));

      const sortedAddresses = formattedAddresses.sort((a: { isDefault: any; }, b: { isDefault: any; }) => {
        if (a.isDefault && !b.isDefault) return -1;
        if (!a.isDefault && b.isDefault) return 1;
        return 0;
      });

      setAddresses(sortedAddresses);
    } catch (error) {
      console.error("Error fetching user addresses:", error);
      setAlertMsg("Failed to load addresses. Please try again.");
      setAlertType('error');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchUserAddresses();
  };

  const handleEdit = (address: Address) => {
    setCurrentAddress(address);
    setFormData(address);
    setEditModalVisible(true);
  };

  const handleDelete = (id: string) => {
    const addressToDelete = addresses.find(addr => addr.id === id);
    if (addressToDelete) {
      setSelectedAddressId(id);
      setDeleteModalVisible(true);
    }
  };

  const confirmDeleteAddress = async () => {
    if (!selectedAddressId) return;

    setDeleteLoading(true);
    try {
      await deleteAddress(selectedAddressId);
      setDeleteModalVisible(false);
    } catch (error) {
      console.error("Error in confirm delete:", error);
    } finally {
      setDeleteLoading(false);
      setSelectedAddressId(null);
    }
  };

  const deleteAddress = async (id: string) => {
    try {
      setLoading(true);
      const userId = auth.currentUser?.uid;

      if (!userId) {
        console.log("No user logged in");
        setLoading(false);
        return;
      }

      const userRef = doc(db, "Users", userId);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        console.log("User not found");
        setLoading(false);
        return;
      }

      const userData = userDoc.data();
      const userAddresses = userData.Address || [];

      const addressToRemove = userAddresses.find((addr: any) => addr.id === id);

      if (!addressToRemove) {
        console.log("Address not found");
        setLoading(false);
        return;
      }

      console.log("Deleting address:", addressToRemove);

      try {
        await updateDoc(userRef, {
          Address: arrayRemove(addressToRemove)
        });
        console.log("Address deleted successfully");
      } catch (removeError) {
        console.error("Error in arrayRemove operation:", removeError);

        try {
          console.log("Trying alternate delete approach");
          const updatedDoc = await getDoc(userRef);
          const updatedData = updatedDoc.data();
          const updatedAddresses = updatedData?.Address ?? [];

          const filteredAddresses = updatedAddresses.filter(
            (addr: any) => addr.id !== id
          );

          await updateDoc(userRef, {
            Address: filteredAddresses
          });
          console.log("Address deleted using alternate approach");
        } catch (alternateError) {
          console.error("Error in alternate delete approach:", alternateError);
          throw alternateError;
        }
      }

      await fetchUserAddresses();
      setAlertMsg("Address deleted successfully");
      setAlertType('success');
    } catch (error) {
      console.error("Error deleting address:", error);
      setAlertMsg("Failed to delete address. Please try again.");
      setAlertType('error');
    } finally {
      setLoading(false);
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      setLoading(true);
      const userId = auth.currentUser?.uid;

      if (!userId) {
        console.log("No user logged in");
        setLoading(false);
        return;
      }

      const userRef = doc(db, "Users", userId);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        console.log("User not found");
        setLoading(false);
        return;
      }

      const userData = userDoc.data();
      const userAddresses = userData.Address || [];

      const addressToUpdate = userAddresses.find((addr: any) => addr.id === id);

      if (!addressToUpdate) {
        console.log("Address not found");
        setLoading(false);
        return;
      }

      const isSettingAsDefault = !addressToUpdate.isDefault;

      if (isSettingAsDefault) {
        const currentDefault = userAddresses.find((addr: any) => addr.isDefault && addr.id !== id);
        if (currentDefault) {
          const updatedCurrentDefault = { ...currentDefault, isDefault: false };

          await updateDoc(userRef, {
            Address: arrayRemove(currentDefault)
          });
          await updateDoc(userRef, {
            Address: arrayUnion(updatedCurrentDefault)
          });
        }
      }

      const updatedAddress = { ...addressToUpdate, isDefault: isSettingAsDefault };

      await updateDoc(userRef, {
        Address: arrayRemove(addressToUpdate)
      });
      await updateDoc(userRef, {
        Address: arrayUnion(updatedAddress)
      });

      await fetchUserAddresses();

      if (isSettingAsDefault) {
        setAlertMsg("Default address updated successfully");
      } else {
        setAlertMsg("Default address removed");
      }
      setAlertType('success');
    } catch (error) {
      console.error("Error toggling default address:", error);
      setAlertMsg("Failed to update default address. Please try again.");
      setAlertType('error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAddress = async () => {
    if (!formData.FullName || !formData.Street || !formData.City || !formData.State || !formData.ZIP || !formData.Phone) {
      setAlertMsg('Please fill in all required fields');
      setAlertType('error');
      return;
    }

    try {
      setLoading(true);
      const userId = auth.currentUser?.uid;

      if (!userId) {
        console.log("No user logged in");
        setLoading(false);
        return;
      }

      const userRef = doc(db, "Users", userId);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        console.log("User not found");
        setLoading(false);
        return;
      }

      const userData = userDoc.data();
      const userAddresses = userData.Address || [];

      const existingAddress = userAddresses.find((addr: any) => addr.id === formData.id);

      if (!existingAddress) {
        console.log("Address not found");
        setLoading(false);
        return;
      }

      const updatedAddress = {
        id: formData.id,
        FullName: formData.FullName,
        Street: formData.Street,
        City: formData.City,
        State: formData.State,
        ZIP: formData.ZIP,
        Phone: formData.Phone,
        isDefault: existingAddress.isDefault
      };

      await updateDoc(userRef, {
        Address: arrayRemove(existingAddress)
      });

      await updateDoc(userRef, {
        Address: arrayUnion(updatedAddress)
      });

      await fetchUserAddresses();
      setEditModalVisible(false);
      setCurrentAddress(null);
      setAlertMsg("Address updated successfully");
      setAlertType('success');
    } catch (error) {
      console.error("Error updating address:", error);
      setAlertMsg("Failed to update address. Please try again.");
      setAlertType('error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddNew = () => {
    setFormData({
      id: Date.now().toString(),
      FullName: '',
      Street: '',
      City: '',
      State: '',
      ZIP: '',
      Phone: '',
      isDefault: false,
    });
    setNewAddressModalVisible(true);
  };

  const handleCreateAddress = async () => {
    if (!formData.FullName || !formData.Street || !formData.City || !formData.State || !formData.ZIP || !formData.Phone) {
      setAlertMsg('Please fill in all required fields');
      setAlertType('error');
      return;
    }

    try {
      setLoading(true);
      const userId = auth.currentUser?.uid;

      if (!userId) {
        console.log("No user logged in");
        setLoading(false);
        return;
      }

      const userRef = doc(db, "Users", userId);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        console.log("User not found");
        setLoading(false);
        return;
      }

      const newAddress = {
        id: formData.id,
        FullName: formData.FullName,
        Street: formData.Street,
        City: formData.City,
        State: formData.State,
        ZIP: formData.ZIP,
        Phone: formData.Phone,
        isDefault: false
      };

      await updateDoc(userRef, {
        Address: arrayUnion(newAddress)
      });

      await fetchUserAddresses();
      setNewAddressModalVisible(false);
      setAlertMsg("New address added successfully");
      setAlertType('success');
    } catch (error) {
      console.error("Error adding address:", error);
      setAlertMsg("Failed to add address. Please try again.");
      setAlertType('error');
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (field: keyof Address, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <>
      <Stack.Screen
        name="address"
        options={{
          headerShown: false
        }}
      />
      <LinearGradient
        colors={['white', '#FFE4C4']}
        style={styles.container}
      >
        {alertMsg && (
          <MiniAlert
            message={alertMsg}
            type={alertType}
            onHide={() => setAlertMsg(null)}
          />
        )}

        <Modal
          visible={deleteModalVisible}
          animationType="fade"
          transparent={true}
          onRequestClose={() => setDeleteModalVisible(false)}
        >
          <View style={styles.deleteModalOverlay}>
            <View style={styles.deleteModalContent}>
              <View style={styles.deleteModalHeader}>
                <MaterialIcons name="delete" size={36} color="#FF5252" />
                <Text style={styles.deleteModalTitle}>
                  Delete Address
                </Text>
              </View>

              <Text style={styles.deleteModalText}>
                Are you sure you want to delete this address?
                {selectedAddressId && addresses.find(a => a.id === selectedAddressId)?.isDefault && (
                  <Text style={styles.warningText}>
                    {"\n\n"}Warning: This is your default address.
                  </Text>
                )}
              </Text>

              <View style={styles.deleteModalButtons}>
                <TouchableOpacity
                  style={[styles.deleteModalButton, styles.cancelButton]}
                  onPress={() => setDeleteModalVisible(false)}
                  disabled={deleteLoading}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.deleteModalButton, styles.confirmButton]}
                  onPress={confirmDeleteAddress}
                  disabled={deleteLoading}
                >
                  {deleteLoading ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <Text style={styles.confirmButtonText}>Delete</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => { router.back() }}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="arrow-back-circle-outline" size={36} color="#5D4037" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Addresses</Text>
        </View>

        {loading && !refreshing ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#8D6E63" />
            <Text style={styles.loadingText}>Loading your addresses...</Text>
          </View>
        ) : addresses.length > 0 ? (
          <ScrollView
            style={styles.addressList}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={['#8D6E63']}
                tintColor="#8D6E63"
              />
            }
          >
            {addresses.map(address => (
              <AddressCard
                key={address.id}
                address={address}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onSetDefault={handleSetDefault}
              />
            ))}
            <View style={styles.bottomSpace} />
          </ScrollView>
        ) : (
          <ScrollView
            contentContainerStyle={styles.emptyScrollContent}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={['#8D6E63']}
                tintColor="#8D6E63"
              />
            }
          >
            <EmptyAddresses />
          </ScrollView>
        )}

        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddNew}
          disabled={loading}
        >
          <Ionicons name="add" size={24} color="white" />
          <Text style={styles.addButtonText}>Add New Address</Text>
        </TouchableOpacity>

        <Modal
          visible={editModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setEditModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setEditModalVisible(false)}
                  disabled={loading}
                >
                  <AntDesign name="close" size={24} color="#5D4037" />
                </TouchableOpacity>
                <Text style={styles.modalTitle}>Edit Address</Text>
              </View>

              <ScrollView style={styles.formContainer}>
                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Full Name</Text>
                  <TextInput
                    style={styles.formInput}
                    value={formData.FullName}
                    onChangeText={(text) => handleFormChange('FullName', text)}
                    placeholder="Enter your full name"
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Street Address</Text>
                  <TextInput
                    style={styles.formInput}
                    value={formData.Street}
                    onChangeText={(text) => handleFormChange('Street', text)}
                    placeholder="Enter street address"
                  />
                </View>

                <View style={styles.formRow}>
                  <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
                    <Text style={styles.formLabel}>City</Text>
                    <TextInput
                      style={styles.formInput}
                      value={formData.City}
                      onChangeText={(text) => handleFormChange('City', text)}
                      placeholder="City"
                    />
                  </View>

                  <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
                    <Text style={styles.formLabel}>State</Text>
                    <TextInput
                      style={styles.formInput}
                      value={formData.State}
                      onChangeText={(text) => handleFormChange('State', text)}
                      placeholder="State"
                      maxLength={2}
                    />
                  </View>
                </View>

                <View style={styles.formRow}>
                  <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
                    <Text style={styles.formLabel}>ZIP Code</Text>
                    <TextInput
                      style={styles.formInput}
                      value={formData.ZIP}
                      onChangeText={(text) => handleFormChange('ZIP', text)}
                      placeholder="ZIP Code"
                      keyboardType="number-pad"
                      maxLength={5}
                    />
                  </View>

                  <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
                    <Text style={styles.formLabel}>Phone Number</Text>
                    <TextInput
                      style={styles.formInput}
                      value={formData.Phone}
                      onChangeText={(text) => handleFormChange('Phone', text)}
                      placeholder="Phone Number"
                      keyboardType="phone-pad"
                    />
                  </View>
                </View>

                <View style={styles.noteContainer}>
                  <Text style={styles.noteText}>
                    Note: You can set this as your default address after saving.
                  </Text>
                </View>
              </ScrollView>

              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleUpdateAddress}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="white" size="small" />
                ) : (
                  <Text style={styles.submitButtonText}>Save Changes</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Modal
          visible={newAddressModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setNewAddressModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setNewAddressModalVisible(false)}
                  disabled={loading}
                >
                  <AntDesign name="close" size={24} color="#5D4037" />
                </TouchableOpacity>
                <Text style={styles.modalTitle}>Add New Address</Text>
              </View>

              <ScrollView style={styles.formContainer}>
                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Full Name</Text>
                  <TextInput
                    style={styles.formInput}
                    value={formData.FullName}
                    onChangeText={(text) => handleFormChange('FullName', text)}
                    placeholder="Enter your full name"
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Street Address</Text>
                  <TextInput
                    style={styles.formInput}
                    value={formData.Street}
                    onChangeText={(text) => handleFormChange('Street', text)}
                    placeholder="Enter street address"
                  />
                </View>

                <View style={styles.formRow}>
                  <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
                    <Text style={styles.formLabel}>City</Text>
                    <TextInput
                      style={styles.formInput}
                      value={formData.City}
                      onChangeText={(text) => handleFormChange('City', text)}
                      placeholder="City"
                    />
                  </View>

                  <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
                    <Text style={styles.formLabel}>State</Text>
                    <TextInput
                      style={styles.formInput}
                      value={formData.State}
                      onChangeText={(text) => handleFormChange('State', text)}
                      placeholder="State"
                    />
                  </View>
                </View>

                <View style={styles.formRow}>
                  <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
                    <Text style={styles.formLabel}>ZIP Code</Text>
                    <TextInput
                      style={styles.formInput}
                      value={formData.ZIP}
                      onChangeText={(text) => handleFormChange('ZIP', text)}
                      placeholder="ZIP Code"
                      keyboardType="number-pad"
                    />
                  </View>

                  <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
                    <Text style={styles.formLabel}>Phone Number</Text>
                    <TextInput
                      style={styles.formInput}
                      value={formData.Phone}
                      onChangeText={(text) => handleFormChange('Phone', text)}
                      placeholder="Phone Number"
                      keyboardType="phone-pad"
                    />
                  </View>
                </View>
              </ScrollView>

              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleCreateAddress}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="white" size="small" />
                ) : (
                  <Text style={styles.submitButtonText}>Save Address</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </LinearGradient>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    width: '100%',
    paddingTop: 60,
    paddingBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(109, 76, 65, 0.2)',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#4E342E',
    textAlign: 'center',
  },
  backButton: {
    position: 'absolute',
    left: 15,
    top: 55,
    zIndex: 10,
  },
  addressList: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  emptyScrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addressCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  addressContent: {
    marginBottom: 10,
  },
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  addressName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#5D4037',
  },
  defaultBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  defaultText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  addressDetail: {
    fontSize: 16,
    color: '#5D4037',
    marginBottom: 4,
  },
  addressActions: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    borderTopWidth: 1,
    borderTopColor: '#EADDD0',
    paddingTop: 10,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  actionText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#5D4037',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#5D4037',
    borderRadius: 50,
    paddingVertical: 16,
    marginHorizontal: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#5D4037',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#8D6E63',
    textAlign: 'center',
    marginTop: 8,
  },
  bottomSpace: {
    height: 80,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 22,
    height: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EADDD0',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#5D4037',
  },
  closeButton: {
    position: 'absolute',
    left: 0,
    padding: 5,
  },
  formContainer: {
    flex: 1,
    marginBottom: 20,
  },
  formGroup: {
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#5D4037',
    marginBottom: 6,
  },
  formInput: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  formRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  noteContainer: {
    backgroundColor: '#FFF8E1',
    borderRadius: 8,
    padding: 12,
    marginTop: 10,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#FFB300',
  },
  noteText: {
    fontSize: 14,
    color: '#795548',
    lineHeight: 18,
  },
  submitButton: {
    backgroundColor: '#5D4037',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#6D4C41',
    marginTop: 15,
    fontSize: 16,
    fontWeight: '500',
  },
  deleteModalContent: {
    width: '85%',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 22,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  deleteModalHeader: {
    alignItems: 'center',
    marginBottom: 15,
  },
  deleteModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
  },
  deleteModalText: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 20,
  },
  deleteModalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  deleteModalButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#f1f2f6',
    marginRight: 10,
  },
  cancelButtonText: {
    color: '#555',
    fontWeight: 'bold',
  },
  confirmButton: {
    backgroundColor: '#FF5252',
  },
  confirmButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  warningText: {
    color: '#FF9800',
    fontWeight: 'bold',
  },
  deleteModalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
});

export default address;