// ==========================================
// MECHA PLAYER CLASS
// 메카 스타일 플레이어 캐릭터
// ==========================================

// 먼저 메카용 머티리얼 추가 (MATS 객체에 추가)
const MATS_MECHA = {
    mechaBody: new THREE.MeshStandardMaterial({ color: 0x2c3e50, metalness: 0.8, roughness: 0.2 }),
    mechaAccent: new THREE.MeshStandardMaterial({ color: 0x00d2d3, metalness: 0.9, roughness: 0.1, emissive: 0x00d2d3, emissiveIntensity: 0.3 }),
    mechaJoint: new THREE.MeshStandardMaterial({ color: 0x34495e, metalness: 0.7, roughness: 0.3 }),
    
    // 무기별 머리 머티리얼
    headPistol: new THREE.MeshStandardMaterial({ color: 0x3498db, metalness: 0.8, roughness: 0.2, emissive: 0x3498db, emissiveIntensity: 0.2 }),
    headShotgun: new THREE.MeshStandardMaterial({ color: 0xe74c3c, metalness: 0.8, roughness: 0.2, emissive: 0xe74c3c, emissiveIntensity: 0.2 }),
    headRifle: new THREE.MeshStandardMaterial({ color: 0xf39c12, metalness: 0.8, roughness: 0.2, emissive: 0xf39c12, emissiveIntensity: 0.2 }),
    headRocket: new THREE.MeshStandardMaterial({ color: 0x9b59b6, metalness: 0.8, roughness: 0.2, emissive: 0x9b59b6, emissiveIntensity: 0.2 }),
};

class MechaPlayer {
    constructor() {
        this.group = new THREE.Group();
        
        // ===== 하체 (다리) =====
        this.leftLeg = new THREE.Group();
        const leftThigh = addMesh(this.leftLeg, GEOS.capsule, MATS_MECHA.mechaBody, { 
            pos: [0, -0.5, 0], 
            scale: [0.6, 1.2, 0.6] 
        });
        const leftKnee = addMesh(this.leftLeg, GEOS.sphere, MATS_MECHA.mechaJoint, { 
            pos: [0, -1.2, 0], 
            scale: 0.4 
        });
        const leftShin = addMesh(this.leftLeg, GEOS.capsule, MATS_MECHA.mechaBody, { 
            pos: [0, -1.8, 0], 
            scale: [0.5, 1.0, 0.5] 
        });
        const leftFoot = addMesh(this.leftLeg, GEOS.box, MATS_MECHA.mechaAccent, { 
            pos: [0, -2.5, 0.2], 
            scale: [0.6, 0.3, 0.8] 
        });
        this.leftLeg.position.set(-0.5, 0, 0);
        this.group.add(this.leftLeg);
        
        this.rightLeg = this.leftLeg.clone();
        this.rightLeg.position.set(0.5, 0, 0);
        this.group.add(this.rightLeg);
        
        // ===== 동체 =====
        this.torso = addMesh(this.group, GEOS.box, MATS_MECHA.mechaBody, { 
            pos: [0, 0.8, 0], 
            scale: [1.4, 1.6, 1.0] 
        });
        const chest = addMesh(this.group, GEOS.box, MATS_MECHA.mechaAccent, { 
            pos: [0, 1.3, 0.3], 
            scale: [1.0, 0.8, 0.4] 
        });
        
        // ===== 팔 =====
        this.leftArm = new THREE.Group();
        const leftShoulder = addMesh(this.leftArm, GEOS.sphere, MATS_MECHA.mechaJoint, { 
            pos: [0, 0, 0], 
            scale: 0.4 
        });
        const leftUpperArm = addMesh(this.leftArm, GEOS.capsule, MATS_MECHA.mechaBody, { 
            pos: [0, -0.6, 0], 
            scale: [0.4, 1.0, 0.4] 
        });
        const leftElbow = addMesh(this.leftArm, GEOS.sphere, MATS_MECHA.mechaJoint, { 
            pos: [0, -1.2, 0], 
            scale: 0.3 
        });
        const leftForearm = addMesh(this.leftArm, GEOS.capsule, MATS_MECHA.mechaBody, { 
            pos: [0, -1.7, 0], 
            scale: [0.35, 0.8, 0.35] 
        });
        const leftHand = addMesh(this.leftArm, GEOS.box, MATS_MECHA.mechaAccent, { 
            pos: [0, -2.2, 0], 
            scale: [0.4, 0.4, 0.4] 
        });
        this.leftArm.position.set(-1.0, 1.2, 0);
        this.group.add(this.leftArm);
        
        this.rightArm = this.leftArm.clone();
        this.rightArm.position.set(1.0, 1.2, 0);
        this.group.add(this.rightArm);
        
        // ===== 머리 (무기로 변환되는 부분) =====
        this.head = new THREE.Group();
        this.headMesh = addMesh(this.head, GEOS.box, MATS_MECHA.headPistol, { 
            pos: [0, 0, 0], 
            scale: [1.0, 0.8, 1.0] 
        });
        
        // 무기 형태 디테일
        this.weaponBarrel = addMesh(this.head, GEOS.cylinder, MATS_MECHA.mechaAccent, { 
            pos: [0, 0, 0.8], 
            scale: [0.2, 0.6, 0.2], 
            rot: [Math.PI/2, 0, 0] 
        });
        this.weaponSight = addMesh(this.head, GEOS.box, MATS_MECHA.mechaAccent, { 
            pos: [0, 0.5, 0], 
            scale: [0.2, 0.3, 0.2] 
        });
        
        // 발광 코어
        this.core = addMesh(this.head, GEOS.sphere, MATS_MECHA.mechaAccent, { 
            pos: [0, 0, -0.3], 
            scale: 0.4 
        });
        
        this.head.position.set(0, 2.5, 0);
        this.group.add(this.head);
        
        scene.add(this.group);
        
        this.walkPhase = 0;
        this.currentWeapon = 'pistol';
    }
    
    // 무기 타입에 따라 머리 형태 변경
    updateHeadWeapon(weaponType) {
        this.currentWeapon = weaponType;
        
        switch(weaponType) {
            case 'pistol':
                this.headMesh.material = MATS_MECHA.headPistol;
                this.headMesh.scale.set(1.0, 0.8, 1.0);
                this.weaponBarrel.scale.set(0.2, 0.6, 0.2);
                this.weaponBarrel.position.z = 0.8;
                break;
            case 'shotgun':
                this.headMesh.material = MATS_MECHA.headShotgun;
                this.headMesh.scale.set(1.3, 0.9, 1.2);
                this.weaponBarrel.scale.set(0.4, 0.5, 0.4);
                this.weaponBarrel.position.z = 1.0;
                break;
            case 'rifle':
                this.headMesh.material = MATS_MECHA.headRifle;
                this.headMesh.scale.set(0.9, 0.7, 1.4);
                this.weaponBarrel.scale.set(0.15, 1.0, 0.15);
                this.weaponBarrel.position.z = 1.2;
                break;
            case 'rocket':
                this.headMesh.material = MATS_MECHA.headRocket;
                this.headMesh.scale.set(1.4, 1.0, 1.3);
                this.weaponBarrel.scale.set(0.5, 0.7, 0.5);
                this.weaponBarrel.position.z = 1.1;
                break;
        }
        
        // 발광 효과 강조
        this.headMesh.material.emissiveIntensity = 0.5;
        setTimeout(() => {
            this.headMesh.material.emissiveIntensity = 0.2;
        }, 100);
    }
    
    // 걷기 애니메이션
    animateWalk(isMoving) {
        if (isMoving) {
            this.walkPhase += 0.2;
            const swing = Math.sin(this.walkPhase) * 0.3;
            
            // 다리 스윙
            this.leftLeg.rotation.x = swing;
            this.rightLeg.rotation.x = -swing;
            
            // 팔 스윙 (반대 방향)
            this.leftArm.rotation.x = -swing * 0.5;
            this.rightArm.rotation.x = swing * 0.5;
            
            // 몸통 상하 움직임
            this.torso.position.y = 0.8 + Math.abs(Math.sin(this.walkPhase)) * 0.1;
        } else {
            // 부드럽게 원위치
            this.leftLeg.rotation.x *= 0.9;
            this.rightLeg.rotation.x *= 0.9;
            this.leftArm.rotation.x *= 0.9;
            this.rightArm.rotation.x *= 0.9;
        }
    }
    
    // 타겟 조준
    lookAt(target) {
        // 몸체 회전
        const angle = Math.atan2(
            target.x - this.group.position.x, 
            target.z - this.group.position.z
        );
        this.group.rotation.y = angle;
        
        // 머리가 타겟을 향하도록
        const dx = target.x - this.group.position.x;
        const dz = target.z - this.group.position.z;
        const dist = Math.sqrt(dx * dx + dz * dz);
        const dy = target.y - (this.group.position.y + 2.5);
        const pitch = -Math.atan2(dy, dist);
        this.head.rotation.x = pitch;
    }
}

// 사용 예시:
// const player = new MechaPlayer();
// player.updateHeadWeapon('shotgun'); // 무기 변경
// player.animateWalk(true); // 걷기 애니메이션
// player.lookAt(enemyPosition); // 적 조준
